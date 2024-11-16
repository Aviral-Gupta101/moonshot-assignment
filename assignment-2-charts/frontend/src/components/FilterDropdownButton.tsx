import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DatePickerWithRange } from "./DatePickerWithRange"
import { DateRange } from "react-day-picker"
import axios from "axios"
import { LoaderCircle } from "lucide-react"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import { SERVER_ADDRESS } from "@/global/global-variables"
import { useSetRecoilState } from "recoil"
import { applyFilterStateChangeAtom } from "@/store/chart-store"
import { Card } from "./ui/card"


const ageDropDownItems = [
    {
        text: "all",
        value: "all"
    },
    {
        text: "15-25",
        value: "15-25"
    },
    {
        text: ">25",
        value: ">25"
    },
]

const genderDropDownItems = [
    {
        text: "all",
        value: "all"
    },
    {
        text: "Male",
        value: "Male"
    },
    {
        text: "Female",
        value: "Female"
    },
]

type Props = {

    setBarChartDataset: React.Dispatch<React.SetStateAction<{
        key: string;
        value: number;
    }[]>>
}

export function FilterDropdownButton({ setBarChartDataset }: Props) {

    const [age, setAge] = React.useState<"all" | "15-25" | ">25">("all")
    const [gender, setGender] = React.useState<"all" | "Male" | "Female">("all")
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2022, 9, 4),
        to: new Date(2022, 9, 29),
    })

    const [isLoading, setIsLoading] = React.useState(false);
    const [shareLink, setShareLink] = React.useState<null | string>(null);
    const setApplyFilterState = useSetRecoilState(applyFilterStateChangeAtom);
    const navigate = useNavigate();

    // Get and set last used filters from the cookies 
    React.useEffect(() => {

        const ageCookie = Cookies.get("age");
        const genderCookie = Cookies.get("gender");
        const dateFromCookie = Cookies.get("date-from");
        const dateToCookie = Cookies.get("date-to");

        if (ageCookie === "all" || ageCookie === "15-25" || ageCookie === ">25")
            setAge(ageCookie);

        if (genderCookie === "all" || genderCookie === "Male" || genderCookie === "Female")
            setGender(genderCookie);

        if (dateFromCookie && dateToCookie) {

            let dateFromToNum = parseInt(dateFromCookie, 10);
            let dateToToNum = parseInt(dateToCookie, 10);

            setDate({
                from: new Date(dateFromToNum),
                to: new Date(dateToToNum),
            })
        }

    }, [])

    async function handleApplyFilter() {

        try {

            // Store filters info in cookies
            Cookies.set("age", age);
            Cookies.set("gender", gender);

            let dateFrom = "0";
            let dateTo = "0";


            if (date) {

                if (date.from) {
                    dateFrom = date.from.getTime().toString();
                    Cookies.set("date-from", dateFrom);
                }

                if (date.to) {
                    dateTo = date.to.getTime().toString();
                    Cookies.set("date-to", dateTo);
                }
            }

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            setIsLoading(true)
            setApplyFilterState((p) => !p)

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${SERVER_ADDRESS}chart/barchart?age=${age}&gender=${gender}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios.request(config);
            setBarChartDataset(response.data.data);

        }
        catch (error) {
            console.log(error);

        } finally {
            setIsLoading(false);
        }
    }

    function handleShareChart() {

        let dateFrom = "0";
        let dateTo = "0";


        if (date) {

            if (date.from) {
                dateFrom = date.from.getTime().toString();
                Cookies.set("date-from", dateFrom);
            }

            if (date.to) {
                dateTo = date.to.getTime().toString();
                Cookies.set("date-to", dateTo);
            }
        }

        const link = `${window.location.href}share/?age=${age}&gender=${gender}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        setShareLink(link);

    }

    function handleResetPrefrense() {

        Cookies.remove("age");
        Cookies.remove("gender");
        Cookies.remove("date-to");
        Cookies.remove("date-from");

        setShareLink(null);
        setAge("all");
        setGender("all");
        setDate({
            from: new Date(2022, 9, 4),
            to: new Date(2022, 9, 29),
        });
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-5 flex-wrap items-center justify-center">
                <DatePickerWithRange date={date} setDate={setDate} />
                <DropDownButton dropdownItem={ageDropDownItems} setValue={setAge} value={age} title="Age" />
                <DropDownButton dropdownItem={genderDropDownItems} setValue={setGender} value={gender} title="Gender" />
                <Button disabled={isLoading} className="bg-blue-600 w-[130px] sm:w-min " onClick={handleApplyFilter}>
                    {
                        isLoading ? <LoaderCircle className="animate-spin" /> : "Apply Filter"
                    }
                </Button>
                <Button className="w-[130px] sm:w-min bg-yellow-500 text-black hover:text-black hover:bg-white border"
                    onClick={handleShareChart}
                >
                    Share chart
                </Button>

                <Button className="w-[130px] sm:w-min bg-red-600 text-white hover:text-black hover:bg-yellow-500 border"
                    onClick={handleResetPrefrense}
                >
                    Reset Preference
                </Button>

            </div>
            {
                shareLink != null ? <div className="flex justify-center mt-5">

                    <Card className="px-5 py-2 bg-slate-300 text-black">
                        <div className="text-lg font-medium text-center">Share Link</div>
                        <div className="">{shareLink}</div>
                    </Card>
                </div> : <></>
            }
        </div>
    )
}


type DropDownButtonProps = {
    title: string,
    dropdownItem: { value: string, text: string }[]
    value: string,
    setValue: React.Dispatch<React.SetStateAction<any>>
}
function DropDownButton({ value, setValue, dropdownItem, title }: DropDownButtonProps) {

    return (<DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="default" className="w-[130px] sm:w-min">{title}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44 dark">
            <DropdownMenuLabel className="">Select {title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
                {
                    dropdownItem.map((item) =>
                        <DropdownMenuRadioItem value={item.value}>{item.text}</DropdownMenuRadioItem>
                    )
                }
            </DropdownMenuRadioGroup>
        </DropdownMenuContent>
    </DropdownMenu>);

}