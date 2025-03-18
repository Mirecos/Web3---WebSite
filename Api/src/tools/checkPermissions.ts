import { Role } from "@prisma/client";
import { prisma } from "..";
import { PermissionLabel } from "../Authorizations/PermissionLabel";

export async function checkPermission(userRole: Role, allowedRole: PermissionLabel): Promise<boolean> {
    const _role = await prisma.role.findUnique({where: {id: userRole.id}, include: {permissions: true}});
    if(_role == null) return false;
    for(let role of _role.permissions){
        if(role.label === allowedRole)return true
    }
    return false
}