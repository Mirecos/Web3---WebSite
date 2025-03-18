export function getDayBefore(d: Date) : Date {
    let date = new Date(d);
    date.setDate(date.getDate()-1);
    return date;
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

export function numberToMonthName(n: number) : string {
    switch(n){
        case 0: return "Janvier";
        case 1: return "Février";
        case 2: return "Mars";
        case 3: return "Avril";
        case 4: return "Mai";
        case 5: return "Juin";
        case 6: return "Juillet";
        case 7: return "Août";
        case 8: return "Septembre";
        case 9: return "Octobre";
        case 10: return "Novembre";
        case 11: return "Décembre";
        default: return "Inconnu";
    }
}

export function getDateMonthPreviousMonday(d: Date){
    let date = new Date(d);
    while(date.getDay() !== 1){
        date.setDate(date.getDate()-1);
    }
    return date.getDate() + " " + numberToMonthName(date.getMonth());
}

export function getDatePreviousMonday(d: Date){
    let date = new Date(d);
    while(date.getDay() !== 1){
        date.setDate(date.getDate()-1);
    }
    return date.getDate();
}



export function getDateMonthNextSunday(d: Date) {
    let date = new Date(d);
    while(date.getDay() !== 0){
        date.setDate(date.getDate()+1);
    }
    return date.getDate() + " " + numberToMonthName(date.getMonth());
}

export function getDateNextSunday(d: Date) {
    let date = new Date(d);
    while(date.getDay() !== 0){
        date.setDate(date.getDate()+1);
    }
    return date.getDate();
}


export function getYearOfDate(d: Date) {
    return d.getFullYear();
}