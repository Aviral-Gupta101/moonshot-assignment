import express, {Request, Response} from "express"
import bcrypt from "bcrypt"
import {z} from "zod";
import jwt from "jsonwebtoken";
import { UserModel } from "../model/user-model";
import { authVerify } from "../middleware/auth";
const authRouter = express.Router();

const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3, {message: "Password should contain atleast 3 character"}),
})

authRouter.post("/signup", async (req: Request, res: Response) => {

    const parsedBody = authSchema.safeParse(req.body);

    if(!parsedBody.success){

        res.status(400).json(parsedBody.error.issues);
        return;
    }

    const email = parsedBody.data.email;
    const password = parsedBody.data.password;

    try {
        
        const foundUser = await UserModel.findOne({email: email});

        if(foundUser){

            res.status(409).json({message: "User already exists"});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 4);

        await UserModel.create({
            email, password: hashedPassword
        });

        res.json({message: "User created"});

    } catch (error) {
        
        console.log("Error at creating new user", error);
        
        res.sendStatus(500)
    }
});


authRouter.post("/signin", async (req: Request, res: Response) => {

    const parsedBody = authSchema.safeParse(req.body);

    if(!parsedBody.success){

        res.status(400).json(parsedBody.error.issues);
        return;
    }

    const email = parsedBody.data.email;
    const password = parsedBody.data.password;

    try {
        
        const foundUser = await UserModel.findOne({email: email});

        if(!foundUser){

            res.status(401).json({message: "Invalid email or password"});
            return;
        }

        const result = await bcrypt.compare(password, foundUser.password)

        if(!result){

            res.status(401).json({message: "Invalid email or password"});
            return;
        }

        const token = jwt.sign({userId: foundUser._id}, process.env.JWT as string);
        res.json({token: token});

    } catch (error) {
        
        console.log("Error at login", error);
        
        res.sendStatus(500)
    }
});


authRouter.get("/me", authVerify, (req: Request, res: Response) => {

    res.json({message: "Logged in"})
});

export default authRouter;