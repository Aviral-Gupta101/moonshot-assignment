import { useRecoilState} from "recoil";
import { navbarAtom } from "../store/navbar-store";
import { NavButton } from "./NavbarButton";

type Props = {

}

const navbarItems = [
    {
        id: 1,
        title: "unread"
    },
    {
        id: 2,
        title: "read"
    },
    {
        id: 3,
        title: "favorites"
    },
]

export const Navbar = ({ }: Props) => {

    const [activeButtonTitle, setActiveButtonTitle] = useRecoilState(navbarAtom);


    return (
        <nav className="flex flex-row font-light gap-4 text-lg mb-5 text-nowrap flex-nowrap">
            <div>Filter By:</div>
            <div className="space-x-1">

                {
                    navbarItems.map((item) => {

                        if (item.title == activeButtonTitle)
                            return <NavButton setActiveButtonTitle={setActiveButtonTitle} key={item.id} title={item.title} isSelected={true} />

                        return <NavButton setActiveButtonTitle={setActiveButtonTitle} key={item.id} title={item.title} isSelected={false} />
                    })
                }

            </div>
        </nav>
    );
}

export default Navbar;