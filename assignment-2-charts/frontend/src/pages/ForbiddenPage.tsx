import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type Props = {

}
export const ForbiddenPage = ({ }: Props) => {
    return (
        <div className="h-screen w-full flex justify-center items-center flex-col gap-2">
            <h3 className="text-xl capitalize">access denied</h3>
            <h2 className="text-lg capitalize">Please Login To View This Page</h2>
            <Link to={"/login"}>
                <Button>Login</Button>
            </Link>
        </div>
    );
}