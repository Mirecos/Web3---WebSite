import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';
import { CustomError } from '../types/classes/CustomError';
import { prisma } from '..';
import { checkPermission } from '../tools/checkPermissions';
import { PermissionLabel } from '../Authorizations/PermissionLabel';


function UserAllowed(permissions: PermissionLabel[]){
    return (req: Request, res: any, next: NextFunction) => {
        const token = req.headers.cookie?.split('=')[1];
        if (!token) {
            return res.status(401).send(new CustomError('401', 'No token provided', req));
        }
        jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
            if (err) {
                return res.status(401).send(new CustomError('401', 'Invalid token', req));
            }
            let user_db = await prisma.user.findUnique({where: {id: decoded.id, token: token}, include: {role: true}});
            if(!user_db)return res.status(500).send(new CustomError('500', 'Token is valid but user not found', req));

            let is_allowed = true
            for(const permission of permissions){
                if( !(await checkPermission(user_db.role, permission)) ) is_allowed = false
            }

            if(!is_allowed)return res.status(405).send(new CustomError('405', 'Request is not allowed', req));
            (req as any).user = user_db;
            next()
        });
    }
}


export default UserAllowed;