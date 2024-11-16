import express from "express";
import cors from "cors"
import 'dotenv/config'
import { startServer } from "./services/server";
import authRouter from "./routes/auth";
import chartRouter from "./routes/chart";
import { logger } from "./middleware/logger";


const app = express();
const PORT = 3000

// MIDDLEWARES
app.use(express.json());
app.use(cors());
app.use(logger)

// ROUTES MIDDLEWARE
app.use("/auth", authRouter);
app.use("/chart", chartRouter);






startServer(app, PORT);