import express, { Request, Response, Router } from "express";
import { prisma } from "..";
import { CustomError } from "../types/classes/CustomError";
import { Success } from "../types/classes/Success";
import Identify from "../decorators/Identify";

export const nftRouter : Router = express.Router();


nftRouter.get("/getNftImage/:id", Identify(), async (req: Request, res: Response) => {
    const nftId = req.params.id;

    const item = await prisma.nFT.findUnique({
        where: {
            id: parseInt(nftId)
        }
    })
    if(!item){
        res.send(new CustomError("404", "NFT not found", req));
        return;
    }

    res.send(new Success("NFT image url was found.", req, {
        name: item.name,
        description : item.description,
        url: item.url
    }));
})
