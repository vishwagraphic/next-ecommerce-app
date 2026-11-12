'use client';
import { createOrder } from "@/lib/actions/order.action";
import {useFormStatus} from "react-dom";
import {Check, Loader} from "lucide-react";
import {Button} from "@/components/ui/button";
import { useRouter } from "next/navigation";

const PlaceOrderForm = () => {
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await createOrder();
        console.log("REASULT ****************" , result);
        if(result.redirectTo) {
            router.push(result.redirectTo);
        }
    };

    const PlaceOrderButton = () => {
        const { pending } = useFormStatus();
        return (
            <Button type="submit" disabled={pending} className='w-full'>
                {pending ? <Loader className="animate-spin" /> : <Check />}
                {' '} Place Order
            </Button>
        );
    };
    return ( <>
    <form onSubmit={handleSubmit}>
        <PlaceOrderButton />
    </form>
    </> );
}
 
export default PlaceOrderForm;