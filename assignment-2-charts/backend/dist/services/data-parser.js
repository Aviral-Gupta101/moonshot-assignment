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
exports.getLineChartData = exports.getBarChartData = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const csv_parse_1 = require("csv-parse");
const promises_1 = require("stream/promises");
const date_time_formatter_1 = require("../util/date-time-formatter");
const DATA_FILE_PATH = node_path_1.default.join(__dirname, "..", "data/sample_data.csv");
let CSV_DATA = [];
const processFile = () => __awaiter(void 0, void 0, void 0, function* () {
    const records = [];
    const parser = node_fs_1.default
        .createReadStream(DATA_FILE_PATH)
        .pipe((0, csv_parse_1.parse)({}));
    parser.on('readable', function () {
        let record;
        while ((record = parser.read()) !== null) {
            // Work with each record
            records.push(record);
        }
    });
    yield (0, promises_1.finished)(parser);
    return records;
});
function readAndTransformCsvData() {
    return __awaiter(this, void 0, void 0, function* () {
        // Read data from the file
        const data = yield processFile();
        // TRANSFORM THE DATA
        const headers = data[0];
        const rows = data.slice(1);
        if (CSV_DATA.length > 0)
            return CSV_DATA;
        CSV_DATA = rows.map((row) => {
            const record = {};
            headers.forEach((header, index) => {
                record[header] = row[index];
            });
            return record;
        });
        return CSV_DATA;
    });
}
function filterCsvData(filter = {
    dateFrom: "0",
    dateTo: new Date().getTime().toString(),
    age: "all",
    gender: "all"
}) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield readAndTransformCsvData();
        let filteredData = [];
        let dateFrom = Number(filter.dateFrom);
        let dateTo = Number(filter.dateTo);
        if (Number.isNaN(dateFrom) || Number.isNaN(dateTo))
            return [];
        data.forEach((item, _) => {
            const itemTimestamp = (0, date_time_formatter_1.convertDayToTimestamp)(item.Day);
            if (Number.isNaN(itemTimestamp))
                console.log("Invalid Day format");
            // Date filter
            if (Number.isNaN(itemTimestamp) === false && dateFrom <= itemTimestamp && itemTimestamp <= dateTo) {
                //  Case: 1 -> No filter is set
                if (filter.age === "all" && filter.gender === "all") {
                    filteredData.push(item);
                }
                // Case: 2 -> When only age filter is set
                else if (filter.age !== "all" && filter.gender === "all") {
                    if (item.Age === filter.age) {
                        filteredData.push(item);
                    }
                }
                // Case: 3 -> When only gender filter is set
                else if (filter.age === "all" && filter.gender !== "all") {
                    if (item.Gender === filter.gender) {
                        filteredData.push(item);
                    }
                }
                // Case: 4 -> When both age and gender filter are set
                else if (filter.age !== "all" && filter.gender !== "all") {
                    if (item.Gender === filter.gender && item.Age === filter.age) {
                        filteredData.push(item);
                    }
                }
            }
        });
        return filteredData;
    });
}
function getBarChartData(filter = {
    dateFrom: "0",
    dateTo: new Date().getTime().toString(),
    age: "all",
    gender: "all"
}) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield filterCsvData(filter);
        const allDataMap = new Map();
        data.forEach((item, _) => {
            const A = parseInt(item.A, 10);
            const B = parseInt(item.B, 10);
            const C = parseInt(item.C, 10);
            const D = parseInt(item.D, 10);
            const E = parseInt(item.E, 10);
            const F = parseInt(item.F, 10);
            allDataMap.set("A", (allDataMap.get("A") || 0) + A);
            allDataMap.set("B", (allDataMap.get("B") || 0) + B);
            allDataMap.set("C", (allDataMap.get("C") || 0) + C);
            allDataMap.set("D", (allDataMap.get("D") || 0) + D);
            allDataMap.set("E", (allDataMap.get("E") || 0) + E);
            allDataMap.set("F", (allDataMap.get("F") || 0) + F);
        });
        const result = [
            {
                key: "A",
                value: allDataMap.get("A") || 0,
            },
            {
                key: "B",
                value: allDataMap.get("B") || 0,
            },
            {
                key: "C",
                value: allDataMap.get("C") || 0,
            },
            {
                key: "D",
                value: allDataMap.get("D") || 0,
            },
            {
                key: "E",
                value: allDataMap.get("E") || 0,
            },
            {
                key: "F",
                value: allDataMap.get("F") || 0,
            },
        ];
        return result;
    });
}
exports.getBarChartData = getBarChartData;
function getLineChartData(filter = {
    feature: "A",
    dateFrom: "0",
    dateTo: new Date().getTime().toString(),
    age: "all",
    gender: "all"
}) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield filterCsvData(filter);
        const allDataMap = new Map();
        data.forEach((item, _) => {
            let value = 0;
            if (filter.feature === "A")
                value = parseInt(item.A, 10);
            else if (filter.feature === "B")
                value = parseInt(item.B, 10);
            else if (filter.feature === "C")
                value = parseInt(item.C, 10);
            else if (filter.feature === "D")
                value = parseInt(item.D, 10);
            else if (filter.feature === "E")
                value = parseInt(item.E, 10);
            else if (filter.feature === "F")
                value = parseInt(item.F, 10);
            allDataMap.set(item.Day, (allDataMap.get(item.Day) || 0) + value);
        });
        const result = [];
        for (const [key, value] of allDataMap) {
            if (Number.isNaN((0, date_time_formatter_1.convertDayToTimestamp)(key)) === false) {
                result.push({
                    timestamp: (0, date_time_formatter_1.convertDayToTimestamp)(key),
                    value: value,
                    feature: filter.feature,
                    formatedDate: (0, date_time_formatter_1.formatTimestamp)((0, date_time_formatter_1.convertDayToTimestamp)(key))
                });
            }
        }
        const sortedData = result.sort((a, b) => a.timestamp - b.timestamp);
        return sortedData;
    });
}
exports.getLineChartData = getLineChartData;
