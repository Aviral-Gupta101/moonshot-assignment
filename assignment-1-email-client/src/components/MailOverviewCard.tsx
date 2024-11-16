import { useRecoilState } from "recoil";
import { formatTimestamp } from "../utils/timestamp-converter";
import { mailTagsAtom, selectedMailAtom } from "../store/mail-store";
import { UserAvatar } from "./UserAvatar";
import React from "react";


type Props = {

    id: string,
    from: {
        email: string,
        name: string
    },
    date: number,
    subject: string,
    short_description: string,
}

export const MailOverviewCard = React.memo(({ id, from, date, subject, short_description }: Props) => {

    const formattedDate = formatTimestamp(date);
    const [selectedMail, setSelectedMail] = useRecoilState(selectedMailAtom);
    const [mailTags, setMailTags] = useRecoilState(mailTagsAtom);

    const isSelected = selectedMail === id;
    const isOpened = mailTags.find((item) => item.id == id)?.opened
    const favorite = mailTags.find((item) => item.id == id)?.favorite


    return (

        <div className={`flex flex-row box-border min-w-[440px] mb-8 ${isOpened ? "bg-read_background" : "bg-white"} border ${isSelected ? "border-accent" : "border-border"}  rounded-lg space-x-5 px-5 py-4 hover:cursor-pointer`}

            onClick={() => {
                setSelectedMail(id);

                setMailTags((p) => {

                    return p.map((item) => {
                        if (item.id != id)
                            return item;
                        let newItem = { ...item };
                        newItem.opened = true;
                        return newItem;
                    })

                })

            }}
        >

            <UserAvatar name={from.name} />

            <div className="flex flex-col text-[#7A7A7A] font-light gap-2 w-full">

                <div className="flex flex-col gap-[0.5px]">
                    <div>
                        <span className="font-light">From: </span>
                        <span className="text-text font-medium" >
                            <span className="capitalize">{from.name}</span> {`<${from.email}>`}
                        </span>
                    </div>

                    <div>
                        <span className="font-light">Subject: </span>
                        <span className="text-text font-medium" >
                            {subject}
                        </span>
                    </div>
                </div>

                <div className="line-clamp-1" >{short_description}</div>

                <div className="flex flex-row text-sm gap-7">

                    <div>{formattedDate}</div>

                    {
                        favorite ? <div className="text-accent font-semibold">
                            Favorite
                        </div> : <></>
                    }

                </div>

            </div>

        </div>
    );
});

