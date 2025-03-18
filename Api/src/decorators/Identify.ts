import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';
import { CustomError } from '../types/classes/CustomError';
import { prisma } from '..';

// 
// This decorator assure that the token from the request is valid and that the user is in the database.
//  It also allows to access the user object in the request object.
//
function Identify(){
    return (req: Request, res: any, next: NextFunction) => {
        const token = req.headers.cookie?.split('=')[1];
        if (!token) {
            return res.status(401).send(new CustomError('401', 'No token provided', req));
        }
        jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
            if (err) {
                return res.status(401).send(new CustomError('401', 'Invalid token', req));
            }
            let user_db = await prisma.user.findUnique({where: {id: decoded.id, token: token, tokenExpiry: {gt: new Date(Date.now())}}});
            if(!user_db)return res.status(500).send(new CustomError('500', 'User not found, or session expired.', req));
            (req as any).current_user = user_db;
            next()
        });
    }
}


export default Identify;