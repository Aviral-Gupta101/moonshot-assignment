"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../model/user-model");
const auth_1 = require("../middleware/auth");
const authRouter = express_1.default.Router();
const authSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(3, { message: "Password should contain atleast 3 character" }),
});
authRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedBody = authSchema.safeParse(req.body);
    if (!parsedBody.success) {
        res.status(400).json(parsedBody.error.issues);
        return;
    }
    const email = parsedBody.data.email;
    const password = parsedBody.data.password;
    try {
        const foundUser = yield user_model_1.UserModel.findOne({ email: email });
        if (foundUser) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 4);
        yield user_model_1.UserModel.create({
            email, password: hashedPassword
        });
        res.json({ message: "User created" });
    }
    catch (error) {
        console.log("Error at creating new user", error);
        res.sendStatus(500);
    }
}));
authRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedBody = authSchema.safeParse(req.body);
    if (!parsedBody.success) {
        res.status(400).json(parsedBody.error.issues);
        return;
    }
    const email = parsedBody.data.email;
    const password = parsedBody.data.password;
    try {
        const foundUser = yield user_model_1.UserModel.findOne({ email: email });
        if (!foundUser) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const result = yield bcrypt_1.default.compare(password, foundUser.password);
        if (!result) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: foundUser._id }, process.env.JWT);
        res.json({ token: token });
    }
    catch (error) {
        console.log("Error at login", error);
        res.sendStatus(500);
    }
}));
authRouter.get("/me", auth_1.authVerify, (req, res) => {
    res.json({ message: "Logged in" });
});
exports.default = authRouter;
