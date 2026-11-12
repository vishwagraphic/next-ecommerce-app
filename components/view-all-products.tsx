import {Button} from "@/components/ui/button"
import Link from "next/link"

const ViewAllProducts = () => {
    return (
        <div className="flex justify-center items-center my-8">
            <Button className="px-8 py-4 text-lg font-semibold">
                <Link href="/search">View All Products</Link>
            </Button>
        </div>
    );
}

export default ViewAllProducts;