
import ProductCard from "./product-card";
import {Product} from '@/types'

type ProductListProps = {
    data?: Product[] | { products?: Product[] };
    title: string;
    limit?: number;
}

const ProductList = ({ data, title, limit }: ProductListProps) => {
    const products = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
            ? data.products
            : [];

    if (limit !== undefined) {
        products.splice(limit);
    }

    return (
        <div>
            <h2>{title}</h2>
           
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <ProductCard product={product} key={product.id ?? product.slug ?? product.name} />
                ))}
            </div>
           
        </div>
    );
}

export default ProductList;