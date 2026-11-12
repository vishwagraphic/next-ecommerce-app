import Link from 'next/link';
import { deleteProduct, getAllProducts } from '@/lib/actions/product.actions';
import {formatCurrency, formatId} from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {Table, TableHeader, TableRow, TableHead, TableCell, TableBody} from '@/components/ui/table';
import Pagination from '@/components/shared/pagination';
import DeleteDialog from '@/components/delete-dialog';

const ProductPage = async (props: {searchParams: Promise<{page: string, query: string, category: string}>}) => {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const searchText = searchParams.query || "";
    const category = searchParams.category || "";

    const products = await getAllProducts({
        page,
        query: searchText,
        category
    });


    return (  
    <div className="space-y-2">
        <div className="flex-between">
            <h1 className="h2-bold">Products</h1>
            {searchText && <p>Search results for: {searchText}</p>}
            <Button>
                <Link href="/admin/products/create">
                    Create Product
                </Link>
            </Button>
        </div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className='text-right'>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className='w-100'>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                    {products?.data?.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{formatId(product.id)}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell className='text-right'>{formatCurrency(product.price)}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>{product.rating}</TableCell>
                            <TableCell className='flex gap-1'>
                                <Button variant="outline" size="sm">
                                    <Link href={`/admin/products/${product.id}`}>Edit</Link>
                                </Button>
                                <DeleteDialog
                                    id={product.id}
                                    onDelete={deleteProduct}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>

    {products?.totalPages && products.totalPages > 1 && (
        <Pagination
            page={page}
            totalPages={products?.totalPages || 1}
        />
    )}
    {/* Removed the always visible pagination component */}
    </div>
    );
}
 
export default ProductPage;