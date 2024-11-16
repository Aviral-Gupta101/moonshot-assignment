import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { RenderMailList } from "../components/RenderMailList";
import { selectedMailAtom } from "../store/mail-store";
import { MailCard } from "../components/MailCard";
import React from "react";

type Props = {

}
export const HomePage = ({ }: Props) => {

    console.log("Homepage called !!!");


    const selectedMail = useRecoilValue(selectedMailAtom);
    console.log(selectedMail);

    return (
        <>
            <RenderContent isMailSelected={selectedMail !== null} />
        </>
    );
}
 
const RenderContent = React.memo(({isMailSelected}: {isMailSelected : boolean}) => {

    if (isMailSelected != false) {

        return <div className="flex flex-row flex-1 gap-5">
            <div className="basis-2/5 min-w-[440px] max-h-[85vh] overflow-y-scroll">
                <RenderMailList />
            </div>

            <div className="basis-2/3">
                <MailCard />
            </div>
        </div>
    }
    else {
        return <RenderMailList />
    }


})