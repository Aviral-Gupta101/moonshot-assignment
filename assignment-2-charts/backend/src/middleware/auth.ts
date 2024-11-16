import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
    interface Request {
        userId?: string;
    }
}

interface JwtDecoded {
    userId: string,
    iat: number
}

export function authVerify(req: Request, res: Response, next: NextFunction){
    
    const authHeader = req.headers.authorization;

    if(!authHeader){
        res.status(401).json({ message: "Token not found" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT as string) as JwtDecoded;

        req.userId = decoded.userId ; 
        next();

    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }

}