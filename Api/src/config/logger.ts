const fs = require('node:fs');

export enum ErrorLevel {
    SUCCESS = 'success',
    WARN = 'warn',
    ERROR = 'error',
    INFO = 'info'
}

class Logger{

    logFilePath: string = '/var/';

    constructor(){
        console.info('Logger created');
    }

    formatMessage(message: string, type : ErrorLevel){
        return this.getLogPrefixes(type) + message + '\n'
    }

    info(message: string){
        const msg = this.formatMessage(message, ErrorLevel.INFO)
        console.info(msg)
        this.writeToFile(msg)
    }

    error(message: string){
        const msg = this.formatMessage(message, ErrorLevel.ERROR)
        console.error(msg)
        this.writeToFile(msg)
    }

    success(message: string){
        const msg = this.formatMessage(message, ErrorLevel.SUCCESS)
        console.info(msg)
        this.writeToFile(msg)
    }

    warn(message: string){
        const msg = this.formatMessage(message, ErrorLevel.WARN)
        console.warn(message)
        this.writeToFile(message)
    }

    writeToFile(message: string){
        const date = new Date()
        const path = this.logFilePath + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + ".txt";
        
        if(fs.existsSync(path)){
            fs.appendFileSync(path, message);
        }else{
            fs.writeFileSync(path, message);
        }
    }

    getLogPrefixes(type : ErrorLevel ){
        return `[${type.toUpperCase()}][${new Date().toISOString()}]`
    }
}

export const logger = new Logger();
