import HorizontalBarChart from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { FilterDropdownButton } from "@/components/FilterDropdownButton";
import { Card } from "@/components/ui/card";
import { useState } from "react";

type Props = {

}

export const HomePage = ({ }: Props) => {

    const [barchartDataset, setBarChartDataset] = useState<{ key: string, value: number }[]>([]);

    return (
        <div className="flex-1 space-y-5 pb-2">

            <div className="flex items-center justify-center h-[62px] bg-slate-300">
                <h2 className="text-2xl font-medium">Dashboard</h2>
            </div>

            <div className="px-5">
                <Card className="flex flex-col px-5 py-2 mt-5  gap-3">
                    <h3 className="text-xl text-center w-full ">Add Filters</h3>
                    <div>
                        <FilterDropdownButton setBarChartDataset={setBarChartDataset} />
                    </div>
                </Card>
            </div>


            <div className="flex flex-col px-5 mt-5">
                <HorizontalBarChart dataset={barchartDataset} setDataset={setBarChartDataset} initalLoading={true} />
                <LineChart />
            </div>

        </div>
    );
}