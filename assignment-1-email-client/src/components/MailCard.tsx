import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { UserAvatar } from "./UserAvatar";
import { mailSelector, mailTagsAtom, selectedMailAtom } from "../store/mail-store";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { formatTimestamp } from "../utils/timestamp-converter";

type Props = {

}
export const MailCard = ({ }: Props) => {

    const selectedMail = useRecoilValue(selectedMailAtom);
    const mailData = useRecoilValue(mailSelector(selectedMail));
    const [contentBody, setContentBody] = useState<string>("");
    const [mailTags, setMailTag] = useRecoilState(mailTagsAtom);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState("");


    const favorite = mailTags.find((item) => item.id === selectedMail)?.favorite;

    async function fetchMail() {

        try {
            setIsLoading(true);

            if (selectedMail === null)
                return;

            const res = await axios.get(`https://flipkart-email-mock.vercel.app/?id=${selectedMail}`);

            setContentBody(res.data.body)

        } catch (error) {
            console.log("Error in fetched mail body", error);
            setIsError("Unable to fetch mail content");

        } finally {
            setIsLoading(false);

            console.log("False loading 1!1");

        }

    }

    useEffect(() => {

        fetchMail();

    }, [selectedMail]);

    function handleMarkFavorite(id: string){

        setMailTag((p) => {

            return p.map((item) => {
                if(item.id != id)
                    return item;
                let newItem = {...item};
                newItem.favorite = !newItem.favorite;

                return newItem;
            })
        })
    }

    function RenderContent() {

        if(isError != ""){
            return <div className="flex-1 w-full flex justify-center items-center  h-full text-red-500">
                {isError}
            </div>
        }

        else if (isLoading) {
            return <div className="flex-1 w-full flex justify-center items-center  h-full">
                <LoaderCircle className="animate-spin" />
            </div>
        }

        else if (isLoading === false) {

            return (
                <>
                    <header className="flex flex-row justify-between ">
                        <div className="flex flex-row gap-5">

                            {
                                mailData ? <UserAvatar name={mailData.from.name} /> : <UserAvatar name="?" />
                            }

                            <div className="flex flex-col gap-4">

                                <h2 className="text-2xl text-text font-medium ">
                                    {mailData ? mailData.subject : "Lorem Ipsum"}
                                </h2>
                                <p className="text-sm text-text-primary">
                                    {
                                        mailData ? formatTimestamp(mailData.date) : "date error"
                                    }
                                </p>
                            </div>
                        </div>

                        {
                            !favorite ? <button className="text-xs h-7 bg-accent text-white  px-3 py-1 rounded-full" onClick={() => {
                                handleMarkFavorite(selectedMail as string)}}
                            >
                                Mark as favorite
                            </button>
                            :
                            <button className="text-xs h-7 bg-black text-white  px-3 py-1 rounded-full" onClick={() => {
                                handleMarkFavorite(selectedMail as string)}}
                            >
                                Remove favorite
                            </button>

                        }

                    </header>

                    <section className="text-sm pl-[68px] text-text-primary mt-5 flex-1 h-full">
                        <div className="Container pb-10" dangerouslySetInnerHTML={{ __html: contentBody }}></div>
                    </section>
                </>
            )
        }

    }


    return (
        <div className="bg-white rounded-lg max-h-[85vh] min-w-[445px] overflow-y-scroll border-border border h-full w-full py-5 px-6 pr-14">
            <RenderContent />
        </div>
    );
}