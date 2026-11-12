import { Metadata } from "next";
import type { ShippingAddress } from "@/types";
import OrderDetailsTable from "./order-details";
import { getOrderById } from "@/lib/actions/order.action";
import {notFound} from "next/navigation"
import { auth } from "@/auth";

export const metadata: Metadata = {
    title: "Order Details",
};
const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {


    const {id} = await props?.params;
    console.log(id);

    const order = await getOrderById(id);

    if(!order) {
        notFound();
    }

    const session = await auth();
    return (
        <div>
            <OrderDetailsTable order={{
                ...order as any,
                shippingAddress: order.shippingAddress as any,
                }} 
                paypalClientId={
                    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ??
                    process.env.PAYPAL_CLIENT_ID ??
                    ""
                }
                isAdmin={session?.user?.role === "admin"}
                />
        </div>
    );
};

export default OrderDetailsPage;