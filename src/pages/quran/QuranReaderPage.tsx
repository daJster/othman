import { Button } from "@/components/ui/button";
import { useQuranReader } from "@/hooks/use-quran-reader"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

export const QuranReaderPage = () => {
    const { nav } = useQuranReader();

    return (
        <div className="flex flex-col justify-center w-full gap-5 items-center">
            <img src={nav?.pageImageUrl(nav.currentPage)} alt={`Page ${nav?.currentPage}`} className="h-full"/>

            <div className="w-full flex justify-between px-5">
                <Button onClick={nav?.goNextPage} className="h-10 w-10">
                    <ArrowLeftIcon/>
                </Button>
                <Button onClick={nav?.goPrevPage} className="h-10 w-10">
                    <ArrowRightIcon />
                </Button>
            </div>
        </div>
    )
}