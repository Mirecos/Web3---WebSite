import { exit } from "process";
import { prisma } from "..";
import { PermissionLabel } from "./PermissionLabel";
import { RoleLabel } from "./RoleLabel";
import bcrypt from 'bcrypt';
import { CustomError } from "../types/classes/CustomError";
import { getPermissions } from "./RolesAndPerms";
import { logger } from "../config/logger";
import { permissionExists, roleExists, userExistsByEmail } from "../tools/VerifyExists";

if( !process.env.ROOT_USER_EMAIL){
    new CustomError("404","Specify an email for the root super-user in the '.env' file. (ROOT_USER_EMAIL)", null)
    exit(1)
}
if( !process.env.ROOT_USER_PASSWORD){
    new CustomError("404","Specify a password for the root super-user in the '.env' file. (ROOT_USER_PASSWORD)", null)
    exit(1)
}

// Define root user
const rootUser = {
    name: "root",
    password: process.env.ROOT_USER_PASSWORD,
    email: process.env.ROOT_USER_EMAIL,
    creationDate: new Date(),
    token: "",
    tokenExpiry: new Date(),
    lastLogin: new Date(),
    role: {
        connect: {label: RoleLabel.SUPERADMIN}
    }
}

// Initialization script
export async function initPermissions(){
    await prisma.permission.deleteMany()
    await prisma.role.deleteMany()

    const permissions = []
    const salt = await bcrypt.genSalt();

    // Create permissions
    for(const item in PermissionLabel){
        permissions.push({label: item})
        if(! await permissionExists(item)){
            logger.info(`Creating permission ${item}` )
            await prisma.permission.create({data: {label: item}})
        }else logger.error(`Permissions ${item} already exists !`)
    }

    // Create Super-Admin role
    if(! await roleExists(RoleLabel.SUPERADMIN)){
        logger.info("Creating role : " + RoleLabel.SUPERADMIN)
        await prisma.role.create({data: {label: RoleLabel.SUPERADMIN, permissions: {connect: permissions}}})
    }else {
        logger.info("Updating role : " + RoleLabel.SUPERADMIN)
        await prisma.role.update({
            where: { label: RoleLabel.SUPERADMIN },
            data: { permissions: { set: permissions.map(p => ({ label: p.label })) } }
        })
    }

    // Create Roles
    for(const item in RoleLabel){
        if(item === RoleLabel.SUPERADMIN)continue
        else{
            if(! await roleExists(item)){
                logger.info(`Creating role : ${item}`)
                await prisma.role.create({data: {label: item, permissions: {connect: getPermissions(item)}}})
            }else logger.error(`Role ${item} already exists !`)
        }
    }

    // Create super-user account
    if(! await userExistsByEmail(rootUser.email)){
        logger.info("Creating super-user.")
        await prisma.user.create({data: {...rootUser, password: await bcrypt.hash(rootUser.password, salt)}})
    }

    // Success
    logger.info("Permissions, roles, and super-user were successfully initialized !")
    return 0
}

export async function updatePermissions(){
    const salt = await bcrypt.genSalt();
    const permissions = []

    // Create permissions
    for(const item in PermissionLabel){
        permissions.push({label: item})
        if(! await permissionExists(item)){
            logger.info(`Creating permission ${item}` )
            await prisma.permission.create({data: {label: item}})
        }else logger.info(`Permissions ${item} already exists !`)
    }

    // Create Super-Admin role
    if(! await roleExists(RoleLabel.SUPERADMIN)){
        logger.info("Creating role : " + RoleLabel.SUPERADMIN)
        await prisma.role.create({data: {label: RoleLabel.SUPERADMIN, permissions: {connect: permissions}}})
    }else {
        logger.info("Updating role : " + RoleLabel.SUPERADMIN)
        await prisma.role.update({
            where: { label: RoleLabel.SUPERADMIN },
            data: { permissions: { set: permissions.map(p => ({ label: p.label })) } }
        })
    }

    // Create Roles
    for(const item in RoleLabel){
        if(item === RoleLabel.SUPERADMIN)continue
        else{
            if(! await roleExists(item)){
                logger.info(`Creating role : ${item}`)
                await prisma.role.create({data: {label: item, permissions: {connect: getPermissions(item)}}})
            }else logger.info(`Role ${item} already exists !`)
        }
    }

    // Create super-user account
    if(! await userExistsByEmail(rootUser.email)){
        logger.info("Creating super-user.")
        await prisma.user.create({data: {...rootUser, password: await bcrypt.hash(rootUser.password, salt)}})
    }else{
        logger.info("Updating super-user.")
        await prisma.user.update({
            where: { email: rootUser.email },
            data: { role: { connect: { label: RoleLabel.SUPERADMIN } } }
        })
    }

    // Success
    logger.info("Permissions, roles, and super-user were successfully initialized !")
    return 0
}
