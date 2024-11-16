import { MailOverviewCard } from "./MailOverviewCard";
import { MailOvervewCardSkeleton } from "./MailOverviewCardSkeletion";
import { Loadable, useRecoilValue, useRecoilValueLoadable } from "recoil";
import { filteredMailSelector, mailFilterAtom, MailSchema } from "../store/mail-store";
import React, { useEffect, useState } from "react";

type Props = {

}

export const RenderMailList = React.memo(({ }: Props) => {
    
    const filteredMails = useRecoilValueLoadable(filteredMailSelector);
    const mailFilterValue = useRecoilValue(mailFilterAtom);
    const [mails, setMails] = useState<Loadable<MailSchema[]>>();

    useEffect(() => {

        setMails(filteredMails)

    }, [filteredMails.state === "hasValue", mailFilterValue])

    

    function RenderContent() {

        if(!mails)
            return <></>

        else if (mails.state === "loading") {
            return <>
                <MailOvervewCardSkeleton />
                <MailOvervewCardSkeleton />
                <MailOvervewCardSkeleton />
                <MailOvervewCardSkeleton />
            </>
        }
        else if (mails.state === "hasError") {
            return <main className="flex flex-1 items-center justify-center">
                <h3 className="text-2xl">Unable to fetch records</h3>
            </main>
        }
        else if(mails.state === "hasValue") {
            
            const length = mails.contents.length;

            if(length > 0)
                return (
                    <main>
                        {

                            mails.contents.map((mail) =>
                                <MailOverviewCard 

                                    key={mail.id} 
                                    id={mail.id}
                                    from={mail.from} 
                                    date={mail.date} 
                                    subject={mail.subject} 
                                    short_description={mail.short_description}
                                />
                            )
                        }
                    </main>
                )
            return <main className="flex justify-center items-center flex-1 h-full">
                <div>No data availabe for the selected filter</div>
            </main>
        }

    }

    return (

        <>
            <RenderContent />
        </>

    );
});
