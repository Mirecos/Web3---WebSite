import { LPEmployeeInput } from "./types";

import { Prisma } from '@prisma/client'
type EmployeeWithFormations = Prisma.EmployeeGetPayload<{
    include: { formations: true }
}>

export function EmployeesToLPInput(employees: EmployeeWithFormations[]): LPEmployeeInput[] {

    return employees.map((e) => {
        return {
            id: e.id,
            name: e.name + ' ' + e.surname,
            hoursPerWeek: e.hoursPerWeek,
            availability: [
                e.MondayNoon? 1 : 0,
                e.MondayEvening? 1 : 0,
                e.TuesdayNoon? 1 : 0,
                e.TuesdayEvening? 1 : 0,
                e.WednesdayNoon? 1 : 0,
                e.WednesdayEvening? 1 : 0,
                e.ThursdayNoon? 1 : 0,
                e.ThursdayEvening? 1 : 0,
                e.FridayNoon? 1 : 0,
                e.FridayEvening? 1 : 0,
                e.SaturdayNoon? 1 : 0,
                e.SaturdayEvening? 1 : 0,
                e.SundayNoon? 1 : 0,
                e.SundayEvening? 1 : 0
            ],
            formations: e.formations.map(f => f.label)
        } as LPEmployeeInput;
    })
}