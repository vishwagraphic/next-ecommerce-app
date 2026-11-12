import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { getAllCategories } from '@/lib/actions/product.actions';
const ProductSearch =  async () => {
    const categories = await getAllCategories();
    return ( 
        <form action="/search" method="get">
            <div className="flex w-full max-w-sm items-center space-x-2">
                <Select name="category" >
                    <SelectTrigger className="w-45">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                       
                            <SelectItem key='All' value='all'>
                                All
                            </SelectItem>
                        {categories?.data?.map((x: any) => (
                            <SelectItem key={x.category} value={x.category}>
                                {x.category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input name='query' type="text" placeholder="Search..." className='md:w-25 lg:w-75' />
                <Button type="submit"><SearchIcon /></Button>
            </div>
        </form>
     );
}
 
export default ProductSearch;