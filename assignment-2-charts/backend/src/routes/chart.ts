import express, { Request, Response } from "express"
import z, { date } from "zod";
import authRouter from "./auth";
import { getBarChartData, getLineChartData } from "../services/data-parser";
const chartRouter = express.Router();

const barChartSchema = z.object({
    dateFrom: z.string().default("0"),
    dateTo: z.string().default(Date.now().toString()),
    age: z.enum(["15-25", ">25", "all"]),
    gender: z.enum(["Male", "Female", "all"])

}).strict();

chartRouter.get("/barchart", authRouter, async (req: Request, res: Response) => {

    const parsedQuery = barChartSchema.safeParse(req.query);

    if (!parsedQuery.success) {

        res.status(400).json(parsedQuery.error.issues)
        return;
    }

    const data = await getBarChartData(parsedQuery.data);

    res.json({ data: data })

})

const lineChartSchema = z.object({
    feature: z.enum(["A", "B", "C", "D", "E", "F"]),
    dateFrom: z.string().default("0"),
    dateTo: z.string().default(Date.now().toString()),
    age: z.enum(["15-25", ">25", "all"]),
    gender: z.enum(["Male", "Female", "all"])

}).strict();

chartRouter.get("/linechart", authRouter, async (req: Request, res: Response) => {

    const parsedQuery = lineChartSchema.safeParse(req.query);

    if (!parsedQuery.success) {

        res.status(400).json(parsedQuery.error.issues)
        return;
    }

    const data = await getLineChartData(parsedQuery.data);

    res.json({ data: data })

})

export default chartRouter;