'use client';
import {useRouter, useSearchParams} from "next/navigation";
import { Button } from "../ui/button";

type PaginationProps = {
    page: number;
    totalPages: number;
    urlParamName?: string;
};

const Pagination = ({page, totalPages, urlParamName}: PaginationProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    // const page = Number(searchParams.get('page') || 1);

    return ( 
        <div className="flex gap-2">
            <Button size="lg" disabled={page <= 1} onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams.toString());
                newSearchParams.set(urlParamName || 'page', (page - 1).toString());
                router.push(`?${newSearchParams.toString()}`);
            }}>
                Prev
            </Button>
           
            {Array.from({length: totalPages}, (_, index) => index + 1).map((pageNumber) => (
                <Button
                    key={pageNumber}
                    onClick={() => {
                        const newSearchParams = new URLSearchParams(searchParams.toString());
                        newSearchParams.set(urlParamName || 'page', pageNumber.toString());
                        router.push(`?${newSearchParams.toString()}`);
                    }}
                    className={`px-3 py-1 mx-1 rounded ${pageNumber === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    {pageNumber}
                </Button>
            ))}
             <Button size="lg" disabled={page >= totalPages} onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams.toString());
                newSearchParams.set(urlParamName || 'page', (page + 1).toString());
                router.push(`?${newSearchParams.toString()}`);
            }}>
                Next
            </Button>
        </div>
     );
}
 
export default Pagination;