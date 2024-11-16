import fs from "node:fs"
import path from "node:path";
import { parse } from 'csv-parse';
import { finished } from 'stream/promises';
import { CsvRecord } from "../interface/csv-record";
import { convertDayToTimestamp, formatTimestamp } from "../util/date-time-formatter";

const DATA_FILE_PATH = path.join(__dirname, "..", "data/sample_data.csv");
let CSV_DATA: CsvRecord[] = [];

const processFile = async () => {
    const records: any = [];
    const parser = fs
        .createReadStream(DATA_FILE_PATH)
        .pipe(parse({

        }));
    parser.on('readable', function () {
        let record; while ((record = parser.read()) !== null) {
            // Work with each record
            records.push(record);
        }
    });
    await finished(parser);
    return records;
};

async function readAndTransformCsvData() {

    // Read data from the file
    const data: string[][] = await processFile();

    // TRANSFORM THE DATA
    const headers = data[0];
    const rows = data.slice(1);

    if (CSV_DATA.length > 0)
        return CSV_DATA;

    CSV_DATA = rows.map((row) => {
        const record: Partial<CsvRecord> = {};
        headers.forEach((header, index) => {
            record[header as keyof CsvRecord] = row[index];
        });
        return record as CsvRecord;
    });

    return CSV_DATA;
}


type BarChartFilter = {
    dateFrom: string
    dateTo: string,
    age: "15-25" | ">25" | "all"
    gender: "Male" | "Female" | "all" // Should be same as value in data except "All"
}

async function filterCsvData(filter: BarChartFilter = {
    dateFrom: "0",
    dateTo: new Date().getTime().toString(),
    age: "all",
    gender: "all"
}) {

    const data = await readAndTransformCsvData();
    let filteredData: CsvRecord[] = [];


    let dateFrom = Number(filter.dateFrom);
    let dateTo = Number(filter.dateTo);

    if (Number.isNaN(dateFrom) || Number.isNaN(dateTo))
        return [];


    data.forEach((item, _) => {

        const itemTimestamp = convertDayToTimestamp(item.Day);

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
}


export async function getBarChartData(filter: BarChartFilter = {
    dateFrom: "0",
    dateTo: new Date().getTime().toString(),
    age: "all",
    gender: "all"
}) {
    const data = await filterCsvData(filter);

    const allDataMap = new Map<string, number>();

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
    ]

    return result;
}

type LineChartFilter = {
    feature: "A" | "B" | "C" | "D" | "E" | "F",
    dateFrom: string
    dateTo: string,
    age: "15-25" | ">25" | "all"
    gender: "Male" | "Female" | "all"
}

export async function getLineChartData(filter: LineChartFilter = {
    feature: "A",
    dateFrom: "0",
    dateTo: new Date().getTime().toString(),
    age: "all",
    gender: "all"
}) {

    const data = await filterCsvData(filter);

    const allDataMap = new Map<string, number>();

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

    const result: { timestamp: number,formatedDate: string, value: number, feature: string }[] = [];

    for (const [key, value] of allDataMap) {

        if (Number.isNaN(convertDayToTimestamp(key)) === false) {
            result.push({
                timestamp: convertDayToTimestamp(key),
                value: value,
                feature: filter.feature,
                formatedDate: formatTimestamp(convertDayToTimestamp(key))
            })
        }

    }

    const sortedData = result.sort((a, b) => a.timestamp - b.timestamp);
    return sortedData;

}
