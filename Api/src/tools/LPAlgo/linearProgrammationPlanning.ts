import { LP } from 'glpk.js';
import GLPK from "glpk.js";
import { LPDailyNeed, LPEmployeeInput, LPResult } from './types';
import { prisma } from '../..';
import { getIndexOfDay } from '../utils';
import { Days } from '@prisma/client';

const shiftBreakpoint = 16

export enum workType {
    kitchen = 'kitchen',
    manager = 'manager',
    service = 'service'
}

export async function assignShifts(employees: LPEmployeeInput[], dailyNeeds: LPDailyNeed[][], workType: workType) {
    const glpk = await GLPK();

    employees = employees.filter((employee)=>employee.formations.includes(workType))
    if(employees.length == 0)throw new Error("The role given as parameters is not given to any employees.")
    const numEmployees = employees.length;
    const numDays = dailyNeeds.length;

    const lp: LP = {
        name: 'Employee Scheduling',
        objective: {
            direction: glpk.GLP_MAX,
            name: 'total_hours',
            vars: []
        },
        subjectTo: []
    };

    // Define decision variables
    for (let i = 0; i < numEmployees; i++) {
        for (let j = 0; j < numDays; j++) {
            for (let k = 0; k < dailyNeeds[j].length; k++) {
                lp.objective.vars.push({ name: `x_${i}_${j}_${k}`, coef: 1 });
                lp.objective.vars.push({ name: `b_${i}_${j}_${k}`, coef: 0 });

            }
        }
    }



    // Add availability constraints
    for (let i = 0; i < numEmployees; i++) {
        for (let j = 0; j < numDays; j++) {
            for (let k = 0; k < dailyNeeds[j].length; k++) {
                const shiftType = dailyNeeds[j][k].hour < shiftBreakpoint ? 'midi' : 'soir';
                const availabilityIndex = shiftType === 'midi' ? j * 2 : j * 2 + 1;
                lp.subjectTo.push({
                    name: `availability_${i}_${j}_${k}`,
                    vars: [{ name: `x_${i}_${j}_${k}`, coef: 1 }],
                    bnds: { type: glpk.GLP_UP, ub: employees[i].availability[availabilityIndex], lb: 0 }
                });
            }
        }
    }


    // Add weekly hours constraints
    for (let i = 0; i < numEmployees; i++) {
        const vars: any[] = [];
        for (let j = 0; j < numDays; j++) {
            for (let k = 0; k < dailyNeeds[j].length; k++) {
                vars.push({ name: `x_${i}_${j}_${k}`, coef: 1 });
            }
        }
        // console.log(employees[i].name)
        // console.log(vars)
        lp.subjectTo.push({
            name: `weekly_hours_${i}`,
            vars: vars,
            bnds: { type: glpk.GLP_FX, ub: employees[i].hoursPerWeek, lb: employees[i].hoursPerWeek }
        });
    }

    // Add daily needs constraints
    for (let j = 0; j < numDays; j++) {
        for (let k = 0; k < dailyNeeds[j].length; k++) {
            const vars: any[] = [];
            for (let i = 0; i < numEmployees; i++) {
                vars.push({ name: `x_${i}_${j}_${k}`, coef: 1 });
            }

            lp.subjectTo.push({
                name: `daily_need_${j}_${k}`,
                vars: vars,
                bnds: { type: glpk.GLP_UP, ub: dailyNeeds[j][k][workType]+1, lb: glpk.GLP_UNBND}
            });
        }
    }

    const M = 1000;
    // Add daily hours constraints
    for (let i = 0; i < numEmployees; i++) {
        for (let j = 0; j < numDays; j++) {
            const noonVars: any[] = [];
            const eveningVars: any[] = [];

            const noonBinaryVars: any[] = [];
            const eveningBinaryVars: any[] = [];

            for (let k = 0; k < dailyNeeds[j].length; k++) {
                if(dailyNeeds[j][k].hour < shiftBreakpoint && employees[i].availability[j * 2] == 1){
                    //NOON
                    noonVars.push({ name: `x_${i}_${j}_${k}`, coef: 1 });
                    noonBinaryVars.push({ name: `x_${i}_${j}_${k}`, coef: 1 });

                } else if(dailyNeeds[j][k].hour >= shiftBreakpoint && employees[i].availability[j * 2 + 1] == 1){
                    //EVENING
                    eveningVars.push({ name: `x_${i}_${j}_${k}`, coef: 1 });
                    eveningBinaryVars.push({ name: `x_${i}_${j}_${k}`, coef: 1 });
                }
            }
            if(employees[i].availability[j * 2] == 1){
                lp.subjectTo.push({
                    name: `daily_hours_${i}_${j}_noon`,
                    vars: noonVars,
                    bnds: { type: glpk.GLP_LO, ub: Infinity, lb: 2 }
                });
                // lp.subjectTo.push({
                //     name: `binary_constraint_${i}_${j}_noon`,
                //     vars: noonBinaryVars,
                //     bnds: { type: glpk.GLP_LO, ub: Infinity, lb: 1 }
                // });

            }
            if(employees[i].availability[j * 2 + 1] == 1){
                lp.subjectTo.push({
                    name: `daily_hours_${i}_${j}_evening`,
                    vars: eveningVars,
                    bnds: { type: glpk.GLP_LO, ub: Infinity, lb: 2 }
                });
                // lp.subjectTo.push({
                //     name: `binary_constraint_${i}_${j}_evening`,
                //     vars: eveningBinaryVars,
                //     bnds: { type: glpk.GLP_LO, ub: Infinity, lb: 1 }
                // });

            }

        }
    }

    // Solve the problem
    const result = glpk.solve(lp, glpk.GLP_MSG_ALL);
    // console.log(result.result);
    // Display the results
    const schedule: { [key: string]: LPResult[] } = {};
    employees.forEach((employee, i) => {
        const id = employee.id.toString();
        schedule[id] = [];
        for (let j = 0; j < numDays; j++) {
            for (let k = 0; k < dailyNeeds[j].length; k++) {
                const varName = `x_${i}_${j}_${k}`;
                const value = result.result.vars[varName];
                schedule[id].push({value: value, day: j, hour: dailyNeeds[j][k].hour, toAdd: false, type: workType});
            }
        }
    });

    // Iterate results and set toAdd to true for shifts that should be added to db
    for(let employeeId in schedule){
        const shifts = schedule[employeeId].filter(shift => shift.value == 1)
        for(let i = 0; i < shifts.length; i++){
            if(
                i == 0 || 
                i == shifts.length - 1 ||
                shifts[i].day != shifts[i - 1].day ||
                shifts[i].day != shifts[i + 1].day ||
                (shifts[i].hour < shiftBreakpoint && shifts[i+1].hour >= shiftBreakpoint) ||
                (shifts[i].hour >= shiftBreakpoint && shifts[i-1].hour < shiftBreakpoint)
            ){
                shifts[i].toAdd = true

            }
        }
        schedule[employeeId] = shifts.filter((shift) => shift.toAdd)    
    }
    // console.log(schedule)
    return schedule
}

export async function saveShiftsResults(schedule: { [key: string]: LPResult[] }, weekNumber: number, year: number, workType: workType) {
    let  workWeek = await prisma.workWeek.findUnique({where: {weekNumber: weekNumber, year: year}})
    if(!workWeek){
        workWeek = await prisma.workWeek.create({data: {weekNumber: weekNumber, year: year}})
    }
    // Save the results to the database
    for (let employee in schedule) {
        for(let day in Days){
            const noonSchedules = schedule[employee].filter(shift => shift.day == getIndexOfDay(day as Days) && shift.hour < shiftBreakpoint)
            const eveningSchedules = schedule[employee].filter(shift => shift.day == getIndexOfDay(day as Days) && shift.hour >= shiftBreakpoint)

            if( noonSchedules.length > 2){
                throw new Error('Invalid number of noon shifts')
            }
            if( eveningSchedules.length > 2){
                throw new Error('Invalid number of evening shifts')
            }

            await prisma.workDay.create({
                data: {
                    employeeId: parseInt(employee),
                    workWeekId: workWeek.id,
                    Days: day as Days,
                    ServiceType: 'NOON',
                    Schedules: noonSchedules.length == 0?'':noonSchedules.map((shift, index) => (shift.hour + (index == 1?1:0) ).toString() + 'H').join(' - '),
                    WorkType: workType
                }
            })

            await prisma.workDay.create({
                data: {
                    employeeId: parseInt(employee),
                    workWeekId: workWeek.id,
                    Days: day as Days,
                    ServiceType: 'EVENING',
                    Schedules: eveningSchedules.length == 0?'':eveningSchedules.map((shift, index) => (shift.hour + (index == 1?1:0)).toString() + 'H').join(' - '),
                    WorkType: workType
                }
            })

        }
    }
}