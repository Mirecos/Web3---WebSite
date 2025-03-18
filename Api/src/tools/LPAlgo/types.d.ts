import { workType } from "./linearProgrammationPlanning";

export interface LPEmployeeInput {
    id: number;
    name: string;
    availability: number[];
    hoursPerWeek: number;
    formations: string[];
}

export interface LPDailyNeed {
    hour: number;
    kitchen: number;
    service: number;
    manager: number;
}

export interface LPResult {
    value: number;
    hour: number;
    day: number;
    toAdd: boolean;
    type: workType
}
