import { PrismaClient } from '@prisma/client'
import express, { Express, Request, Response } from "express";
import { userRouter } from './routes/user';
import { updatePermissions } from './Authorizations/Actions';

export const prisma = new PrismaClient()

const app: Express = express();
const port = parseInt(process.env.PORT || '3000');
const hostname = process.env.HOSTNAME || 'localhost';
app.use(function (req, res, next) {
    console.log(process.env.FRONTEND_URL || "http://localhost:3000")
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || "http://localhost:3000");
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // Pass to next layer of middleware
    next();
});
app.use(express.json());

app.use("/user", userRouter);
app.get("/" , (req: Request, res: Response) => {
    res.send("Api is running correctly.")
});

// Specifying hostname assumes to not open to public network
app.listen(port, hostname, () => {
    updatePermissions()
    if(hostname === "0.0.0.0"){
        console.log(`[server]: Server is running at http://localhost:${port}`);    
    }else{
        console.log(`[server]: Server is running at http://${hostname}:${port}`);        
    }
});