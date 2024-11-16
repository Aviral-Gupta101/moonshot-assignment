import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import { UserAvatar } from "./UserAvatar";
import { mailBodyAtomFamily, mailSelector, mailTagsAtom, selectedMailAtom } from "../store/mail-store";
import { LoaderCircle } from "lucide-react";
import { formatTimestamp } from "../utils/timestamp-converter";

type Props = {

}
export const MailCard = ({ }: Props) => {

    const selectedMail = useRecoilValue(selectedMailAtom);
    const mailData = useRecoilValue(mailSelector(selectedMail));
    const [mailTags, setMailTag] = useRecoilState(mailTagsAtom);
    const getMailBody = useRecoilValueLoadable(mailBodyAtomFamily(selectedMail));

    const favorite = mailTags.find((item) => item.id === selectedMail)?.favorite;


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

        if(getMailBody.state === "hasError"){
            return <div className="flex-1 w-full flex justify-center items-center  h-full text-red-500">
                Something went wrong
            </div>
        }

        else if (getMailBody.state === "loading") {
            return <div className="flex-1 w-full flex justify-center items-center  h-full">
                <LoaderCircle className="animate-spin" />
            </div>
        }

        else if (getMailBody.state === "hasValue" && getMailBody.contents) {

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
                        <div className="Container pb-10" dangerouslySetInnerHTML={{ __html: getMailBody.contents }}></div>
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