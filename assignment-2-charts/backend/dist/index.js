"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const server_1 = require("./services/server");
const auth_1 = __importDefault(require("./routes/auth"));
const chart_1 = __importDefault(require("./routes/chart"));
const logger_1 = require("./middleware/logger");
const app = (0, express_1.default)();
const PORT = 3000;
// MIDDLEWARES
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(logger_1.logger);
// ROUTES MIDDLEWARE
app.use("/auth", auth_1.default);
app.use("/chart", chart_1.default);
(0, server_1.startServer)(app, PORT);
