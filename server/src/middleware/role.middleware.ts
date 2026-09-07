import type {  Request, Response, NextFunction } from "express";
import type { UserRole } from "@prisma/client";

export function authorize(...allowedRoles: UserRole[]){
    return(req: Request, res: Response, next: NextFunction)=>{
        console.log("AUTHORIZE MIDDLEWARE RUNNING:", req.user);
        if(!req.user){
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if(!allowedRoles.includes(req.user.role as UserRole)){
            return res.status(403).json({
                message: "Access Denied",
            });
        };

        next()
    };
}