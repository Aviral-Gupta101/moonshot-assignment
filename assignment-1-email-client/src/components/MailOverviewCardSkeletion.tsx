type Props = {

}
export const MailOvervewCardSkeleton = ({ }: Props) => {
    return (
        <div className="border border-slate-100 shadow bg-white rounded-lg p-4 mb-8 h-[142px] box-border  w-full mx-auto">
            <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-300 h-10 w-10" />
                <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-slate-300 rounded" />
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-2 bg-slate-300 rounded col-span-2" />
                            <div className="h-2 bg-slate-300 rounded col-span-1" />
                        </div>
                        <div className="h-2 bg-slate-300 rounded" />
                    </div>
                </div>
            </div>
        </div>

    );
}

