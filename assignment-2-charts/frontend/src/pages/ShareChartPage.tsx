import HorizontalBarChart from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { SERVER_ADDRESS } from "@/global/global-variables";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function isQueryParamsValid(dateFrom: string | null, dateTo: string | null, age: string | null, gender: string | null) {

    if (dateFrom === null || dateTo === null || age === null || gender === null)
        return false;

    if (Number.isNaN(parseInt(dateFrom)) || Number.isNaN(parseInt(dateTo)))
        return false;

    if (age != "15-25" && age != ">25" && age != "all")
        return false;

    if (gender != "Male" && gender != "Female" && gender != "all")
        return false;

    return true;
}

type Props = {

}
export const ShareChartPage = ({ }: Props) => {

    const [searchParams, _] = useSearchParams()

    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const age = searchParams.get("age");
    const gender = searchParams.get("gender");
    const isValid = isQueryParamsValid(dateFrom, dateTo, age, gender);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(0);

    const [data, setData] = useState<{ key: string, value: number }[]>([]);

    async function fetchData() {
        try {

            const token = localStorage.getItem("token");

            if (!token) {
                // navigate("/login");
                setError(401);
                return;
            }

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${SERVER_ADDRESS}chart/barchart?age=${age}&gender=${gender}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            const res = await axios.request(config);

            setData(res.data.data);

            setIsLoggedIn(true);


        } catch (error) {

            if (axios.isAxiosError(error)) {


                if (error.status !== undefined && error.status !== 401) {
                    setError(401)
                }

            }
            setError(500);
            console.log("Something went wrong with share chart page: ", error);

        }
    }

    useEffect(() => {

        if (isValid) {

            fetchData();
        }

    }, []);

    function RenderContent() {

        if (!isValid) {
            return <main className="min-h-screen flex justify-center items-center flex-col w-full bg-black text-white">
                <h2 className="text-3xl capitalize">
                    Invalid Chart URL
                </h2>
                <div className="text-lg">Please make sure you have copied the URL correct</div>
            </main>
        }

        else {

            if (isLoggedIn === false && error === 401) {

                return (
                    <main className="min-h-screen flex justify-center items-center flex-col w-full bg-black text-white">
                        <h2 className="text-3xl capitalize">
                            Access Denied
                        </h2>
                        <div className="text-lg">Please login and then refresh this page again.</div>
                    </main>
                )
            }

            else if (error != 0) {
                return (
                    <main className="min-h-screen flex justify-center items-center flex-col w-full bg-black text-white">
                        <h2 className="text-3xl capitalize">
                            Something went wrong
                        </h2>
                        <div className="text-lg">Uncaught exception has occured</div>
                    </main>
                )
            }

            return (
                <main className="flex flex-1 flex-col  bg-slate-300 ">
                    <div className="h-[60px] flex justify-center items-center">
                        <div className="text-2xl">Read Only View</div>
                    </div>

                    <div className="flex flex-col px-5 mt-5">
                        <HorizontalBarChart dataset={data} setDataset={setData} initalLoading={false} />
                        <LineChart />
                    </div>

                </main>
            )

        }
    }


    return (
        <RenderContent />
    );
}