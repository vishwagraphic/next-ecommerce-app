import {cn} from "@/lib/utils"
const ProductPrice = ({ price , className }: { price: string; className?: string }) => {
    const stringValue = Number(price).toFixed(2);
    const [initValue, floatValue] = stringValue.split('.');
    return (
        <p className={cn("text-2xl font-bold", className)}>
            <span className="text-xs align-baseline">${initValue}</span>
            <span className="text-xs align-super">{floatValue}</span>
        </p>
    );
};

export default ProductPrice;