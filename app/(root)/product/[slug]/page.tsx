import NotFoundPage from '@/app/not-found';
import ProductPrice from '@/components/shared/product/product-price';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {getProductBySlug} from '@/lib/actions/product.actions'
import { Badge } from 'lucide-react';
import ProductImages from '@/components/shared/product/product-images'

const ProductDetailsPage = async (props: { params: { slug: string } }) => {
    const params = await props.params;
    const product = await getProductBySlug(params.slug);
    return ( 
       <div>
         {product ? (
            <section>
                <div className="flex grid-cols-1 md:grid-cols-5">
                    <div className="col-span-2">
                        <ProductImages images={product.images} />
                    </div>
                    <div className="col-span-2 p-5">
                        <div className="flex flex-col gap-6">
                            <p>{product.brand} {product.category}</p>
                            <h1 className="h3-bold">{product.name}</h1>
                            <p>{product.rating} of {product.numReviews} Reviews</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <ProductPrice 
                                    className="w-24 rounded-full bg-green-100 text-green-800 px-5 py-2" 
                                    price={product.price} 
                                />
                            </div>
                        </div>
                        <div className="mt-10">
                            <p className="font-semibold">Description:</p>
                            <p>{product.description}</p>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <Card>
                            <CardContent className="p-4">
                                <div className="mb-2 flex justify-between">
                                    <div>Price</div>
                                    <div>
                                    <ProductPrice 
                                        className="w-24 rounded-full bg-green-100 text-green-800 px-5 py-2" 
                                        price={product.price} 
                                    />
                                    </div>
                                </div>
                                <div className="mb-2 flex justify-between">
                                    <div>Status</div>
                                    {
                                        product.stock  ? (
                                            <Badge>In Stock</Badge>
                                        ) : (
                                            <Badge>Out of Stock</Badge>
                                        )
                                    }
                                </div>
                                {
                                    product.stock > 0 && (
                                        <Button>Add to Cart</Button>
                                    )
                                }
                                
                            </CardContent>
                        </Card>
                    </div>
                </div>
               
            </section>
        ) : <NotFoundPage />}
       </div>
     );
}
 
export default ProductDetailsPage;