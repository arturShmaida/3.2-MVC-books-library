import { NextFunction, Response, Request } from "express";


export function errorHandler(err: Error,req: Request,res: Response,next: NextFunction){
    if(typeof (err) === "string") {
        return res.status(400).send({message: err})
    }
    return   res.status(500).send({message: err})
}