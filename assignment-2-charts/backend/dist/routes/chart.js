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
const zod_1 = __importDefault(require("zod"));
const auth_1 = __importDefault(require("./auth"));
const data_parser_1 = require("../services/data-parser");
const chartRouter = express_1.default.Router();
const barChartSchema = zod_1.default.object({
    dateFrom: zod_1.default.string().default("0"),
    dateTo: zod_1.default.string().default(Date.now().toString()),
    age: zod_1.default.enum(["15-25", ">25", "all"]),
    gender: zod_1.default.enum(["Male", "Female", "all"])
}).strict();
chartRouter.get("/barchart", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedQuery = barChartSchema.safeParse(req.query);
    if (!parsedQuery.success) {
        res.status(400).json(parsedQuery.error.issues);
        return;
    }
    const data = yield (0, data_parser_1.getBarChartData)(parsedQuery.data);
    res.json({ data: data });
}));
const lineChartSchema = zod_1.default.object({
    feature: zod_1.default.enum(["A", "B", "C", "D", "E", "F"]),
    dateFrom: zod_1.default.string().default("0"),
    dateTo: zod_1.default.string().default(Date.now().toString()),
    age: zod_1.default.enum(["15-25", ">25", "all"]),
    gender: zod_1.default.enum(["Male", "Female", "all"])
}).strict();
chartRouter.get("/linechart", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedQuery = lineChartSchema.safeParse(req.query);
    if (!parsedQuery.success) {
        res.status(400).json(parsedQuery.error.issues);
        return;
    }
    const data = yield (0, data_parser_1.getLineChartData)(parsedQuery.data);
    res.json({ data: data });
}));
exports.default = chartRouter;
