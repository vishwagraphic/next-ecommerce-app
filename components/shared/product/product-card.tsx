import Link from "next/link";
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import { Product } from "@/types";

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="p-0 items-center">
                <Link href={`/product/${product.slug}`}>
                    <Image src={product.images[0]} alt={product.name} height="300" width="300" />
                </Link>
            </CardHeader>
            <CardContent>
                <p className="text-xs">{product.brand}</p>
                <Link href={`/product/${product.slug}` }>
                    <h3 className="text-sm font-medium">{product.name}</h3>
                </Link>
                <div className="flex-between gap-4">
                    <p>{product.rating} Stars</p>
                    {product.stock > 0 ? (
                        <ProductPrice price={product.price} />
                    ) : (
                        <p className="text-destructive">Out of Stock</p>
                    )}
                </div>
            </CardContent>

        </Card>
    );
}
 
export default ProductCard;