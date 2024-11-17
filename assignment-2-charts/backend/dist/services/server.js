"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
function startServer(app, PORT) {
    const MONGO_URL = process.env.MONGO_URL;
    if (!MONGO_URL)
        throw new Error("MONGO_URL not defined in env");
    mongoose_1.default.connect(MONGO_URL);
    mongoose_1.default.connection.once("connected", () => {
        console.log("DB connected");
        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`);
        });
    });
}
exports.startServer = startServer;
