type Props = {
    name: string
}
export const UserAvatar = ({ name }: Props) => {
    return (
        <figure className="flex justify-center items-center bg-accent capitalize min-h-[48px] min-w-[48px] size-12 text-white text-2xl rounded-full">
            {name[0]}
        </figure>
    );
}