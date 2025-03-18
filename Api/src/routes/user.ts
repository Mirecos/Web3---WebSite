import express, { Request, Response, Router } from "express";
import { prisma } from "..";
import { User } from "@prisma/client";
import { CustomError } from "../types/classes/CustomError";
import bcrypt from 'bcrypt';
import { Success } from "../types/classes/Success";
import * as jwt from 'jsonwebtoken';
import { days_token_expiry, JWT_SECRET } from "../config/config";
import Identify from "../decorators/Identify";

export const userRouter : Router = express.Router();

//
//  Limited access routes
//
userRouter.patch("/update", Identify(), async (req: Request, res: Response) => {
    const current_user = (req as any).current_user as User;
    const user_id = req.body.user.id  
    let data : any = {};
    if(req.body.user.email) data.email = req.body.user.email;
    if(req.body.user.name) data.name = req.body.user.name;
    if(JSON.stringify(data) === "{}")res.send(new CustomError("400", "No data to update",req));

    try {
        if(current_user.id == user_id){
            await prisma.user.update({where: {id: current_user.id}, data: {...data}});
            res.send(new Success("User was updated", req));  
        }else{
            res.status(405).send(new CustomError("405", "Request is not allowed",req));
        }
    } catch (error: Error | any) {
        res.status(500).send(
            new CustomError(
                '500', 
                `User was not updated. Verify your request parameters.  ${error.code?`(Error n°${error.code})`:"unknown error"}`,
                req
            )
        );
    }
});


userRouter.delete("/delete", Identify(), async (req: Request, res: Response) => {
    let current_user = (req as any).current_user as User; 
    let user_id = req.body.user.id as number;
    
    // Verify body params
    if(!user_id){
        res.send(new CustomError("400", "User id is missing.", req));
        return;
    }

    try {
        if(current_user.id == user_id){
            await prisma.user.delete({where: {id: user_id}});
            res.send(new Success("User was deleted.", req))
        }else{
            res.status(405).send(new CustomError("405", "Request is not allowed", req));
        }
    } catch (error : Error | any) {
        res.status(500).send(
            new CustomError(
                '500', 
                `User was not updated. Verify your request parameters.  ${error.code?`(Error n°${error.code})`:"unknown error"}`,
                req
            )
        );
    }
});


userRouter.post("/createUser" , async (req: Request, res: Response) => {
    let user = req.body.user as User;
    const salt = await bcrypt.genSalt();


    user.password = await bcrypt.hash(user.password, salt)

    try {
        const new_user = await prisma.user.create({data: {...user}});
        const token = jwt.sign({id: new_user.id}, JWT_SECRET)
        await prisma.user.update({where: {id: new_user.id}, data: {token: token, tokenExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * days_token_expiry) }});
        res.send(new Success("User was created", req));
    } catch (error: Error | any) {
        switch (error.code) {
            case "P2002":
                res.status(400).send(new CustomError('400', "Email already exists", req));
                return;
        }
        res.status(500).send(new CustomError(
            '500',
            `User was not created ${error.code?`(Error n°${error.code})`:"unknown error"}`,
            req
        ));
        return;
    }
});

userRouter.get("/isIdentified", Identify(), async (req: Request, res: Response) => {
    res.send(new Success("User is identified", req));
})

//
//  Routes accessible without being connected
//

// userRouter.post("/register", async (req: Request, res: Response) => {
//     let user = req.body.user as User;
//     const salt = await bcrypt.genSalt();

//     //Avoid overwriting id
//     delete (user as any).id;

//     user.password = await bcrypt.hash(user.password, salt)

//     try {
//         const new_user = await prisma.user.create({data: {...user}});
//         const token = jwt.sign({id: new_user.id}, JWT_SECRET)
//         await prisma.user.update({where: {id: new_user.id}, data: {token: token, tokenExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * days_token_expiry) }});
//         res.send(new Success("User was created", req, {token: token}));
//     } catch (error: Error | any) {
//         switch (error.code) {
//             case "P2002":
//                 res.status(400).send(new CustomError('400', "Email already exists", req));
//                 return;
//         }
//         res.status(500).send(new CustomError(
//             '500',
//             `User was not created ${error.code?`(Error n°${error.code})`:"unknown error"}`,
//             req
//         ));
//         return;
//     }
// });

userRouter.post("/login", async (req: Request, res: Response) => {
    let user = req.body.user as User;
    if(!user || !user.password || !user.email){
        res.status(400).send(new CustomError('400', "Wrong parameters", req));
        return
    }

    let user_db = await prisma.user.findUnique({where: {email: user.email}});
    if(!user_db){
        res.status(400).send(new CustomError('400', "User not found", req));
        return;
    }
    console.log(await !bcrypt.compare(user.password, user_db.password))

    if(!( await bcrypt.compare(user.password, user_db.password))){
        res.status(400).send(new CustomError('400', "Password is incorrect", req));
        return;
    }

    const token = jwt.sign({id: user_db.id}, JWT_SECRET)
    await prisma.user.update({
        where: {id: user_db.id}, 
        data: {
            token: token,
            tokenExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * days_token_expiry) 
        }});
    res.cookie("Authorization", token, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * days_token_expiry});
    res.send(new Success("Successfully authenticated", req));
    return;
});