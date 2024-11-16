import { useEffect, useState } from "react";
import { AgCharts } from "ag-charts-react";
import { AgCartesianChartOptions } from "ag-charts-enterprise";
import "ag-charts-enterprise";
import { useRecoilValue } from "recoil";
import { lineChartDataAtom, lineChartDataLoadingAtom } from "@/store/chart-store";


export const LineChart = () => {

    const data = useRecoilValue(lineChartDataAtom);
    const isLoading = useRecoilValue(lineChartDataLoadingAtom);

    const [options, setOptions] = useState<AgCartesianChartOptions>({
        theme: "ag-default-dark",
        zoom: {
            enabled: true,
            enableSelecting: true,
            panKey: "shift",
            enableScrolling: true,
        },
        tooltip: {
            enabled: true,
        },
        axes: [
            {
                type: "number",
                position: "left",
                title: {
                    text: "Total Time Spent",
                },
                interval: {
                    minSpacing: 80,
                    maxSpacing: 120,
                },
            },
            {
                type: "category", // Use "category" for formatted string labels
                position: "bottom",
                title: {
                    text: "Date",
                },
                label: {
                    autoRotate: false,
                },
            },
        ],
        data: data,
        series: [
            {
                type: "line",
                xKey: "formatedDate", // Use formattedYear for x-axis values
                yKey: "value",
                xName: "Date", // For tooltip and legends
            },
        ],
    });

    useEffect(() => {

        if (isLoading === true) {

            const newOptions = {
                ...options
            };

            newOptions.dataSource = {
                getData: () =>
                    new Promise(() => {}),
            },

                setOptions(newOptions);

        }
        else {

            const newOptions = {
                ...options
            };

            delete newOptions.dataSource;
            newOptions.data = data;

            setOptions(newOptions);
        }

    }, [isLoading]);




    return (
        <>
            <AgCharts className="w-full h-full" options={options} />
        </>
    );
};
