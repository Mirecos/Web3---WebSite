import { logger } from "../../config/logger";
import { extractUserInfo } from "../../tools/utils";
import { Request } from 'express';

export class Success{
    code=200;
    message: string;
    data: any;
    constructor(message: string, req: Request, options?: any) {
        logger.success(extractUserInfo(req) + " " + message)
        this.message = message;
        if(options)this.data = options;
    }
}