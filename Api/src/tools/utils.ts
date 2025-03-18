import { Days } from "@prisma/client";
import { Request } from "express";

export function extractUserInfo(req: Request){
    if((req as any).user){
        let userInfos = `[currentUser: (${((req as any).user as any).email})]`
        return userInfos
    }
    return "[currentUser: (unknown)]"
}

export function getIndexOfDay(day: Days){
    switch(day){
        case 'MONDAY':
            return 0
        case 'TUESDAY':
            return 1
        case 'WEDNESDAY':
            return 2
        case 'THURSDAY':
            return 3
        case 'FRIDAY':
            return 4
        case 'SATURDAY':
            return 5
        case 'SUNDAY':
            return 6
    }
}

export function getDayFromIndex(index: number) : Days{
    switch(index){
        case 0:
            return 'MONDAY'
        case 1:
            return 'TUESDAY'
        case 2:
            return 'WEDNESDAY'
        case 3:
            return 'THURSDAY'
        case 4:
            return 'FRIDAY'
        case 5:
            return 'SATURDAY'
        case 6:
            return 'SUNDAY'
    }
    throw new Error("Invalid index")
}

export function getWeekNumber(d: Date) : number {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    let weekNo = Math.ceil(( ( (d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
    // Return array of year and week number
    return weekNo;
}

export function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}