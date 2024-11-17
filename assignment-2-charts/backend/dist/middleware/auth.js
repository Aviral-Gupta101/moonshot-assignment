"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authVerify = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authVerify(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Token not found" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}
exports.authVerify = authVerify;
