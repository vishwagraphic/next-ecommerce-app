'use client';

import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const AdminSearch = () => {
    const pathname = usePathname();
    const formActionUrl = pathname.includes('/admin/orders') ? 
    '/admin/orders/search' : pathname.includes('/admin/users') ? '/admin/users' : '/admin/products';

    const searchParam = useSearchParams();
    const [queryValue, setQueryValue] = useState(searchParam.get('query') || '');

    useEffect(() => {
        setQueryValue(searchParam.get('query') || '');
    }, [searchParam]);

    return ( 
        <form action={formActionUrl} method="get">
            <Input 
            type='search' 
            placeholder="Search..." 
            className="md:w-25 lg:w-75" 
            name="query" 
            onChange={(e) => setQueryValue(e.target.value)}
            value={queryValue} />
            <button  className="sr-only w-10 h-10">Search</button>
        </form>
     );
}
 
export default AdminSearch;