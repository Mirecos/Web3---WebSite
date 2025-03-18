import { prisma } from "..";

export async function userExists(user_id:number): Promise<boolean> {
    const user = await prisma.user.findUnique({where: {id: user_id}});
    if(user == undefined) return false;
    return true
    
}

export async function userExistsByEmail(email:string): Promise<boolean> {
    const user = await prisma.user.findUnique({where: {email: email}});
    if(user == undefined) return false;
    return true
    
}

export async function roleExists(role_label:string): Promise<boolean> {
    const role = await prisma.role.findUnique({where: {label: role_label}});
    if(role == undefined) return false;
    return true
}

export async function permissionExists(permission_label:string): Promise<boolean> {
    const permission = await prisma.permission.findUnique({where: {label: permission_label}});
    if(permission == undefined) return false;
    return true
}