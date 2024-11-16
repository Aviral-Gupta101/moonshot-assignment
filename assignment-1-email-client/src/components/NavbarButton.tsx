import { SetterOrUpdater, useSetRecoilState } from "recoil";
import { NavbarSelectedField } from "../store/navbar-store";
import { mailFilterAtom } from "../store/mail-store";

type Props = {

    title: any,
    isSelected: boolean
    setActiveButtonTitle: SetterOrUpdater<NavbarSelectedField>
}
export const NavButton = ({ title, isSelected, setActiveButtonTitle }: Props) => {

    const setMailFilter = useSetRecoilState(mailFilterAtom);

    function handleClick(title: NavbarSelectedField){

        setActiveButtonTitle(title);
        setMailFilter(title);
    }

    return (
        <>
            {
                isSelected ?
                    <button className="font-light text-lg capitalize bg-filter_btn px-4 py-[1px] rounded-full ring-1 ring-border" onClick={() => handleClick(title)}>
                        {title}
                    </button>
                    :
                    <button className="font-light text-lg capitalize px-4 py-[1px] rounded-xl" onClick={() => handleClick(title)}>
                        {title}
                    </button>
            }
        </>

    );
}