import { Metadata } from "next";
import type { ShippingAddress } from "@/types";
import OrderDetailsTable from "./order-details";
import { getOrderById } from "@/lib/actions/order.action";
import {notFound} from "next/navigation"
import { auth } from "@/auth";
import Stripe from "stripe";

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

    let client_secret = "";

    if (order.paymentMethod === "Stripe" && !order?.isPaid) {
        const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY ?? "");
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(order.totalPrice) * 100),
            currency: "usd",
            metadata: {
                orderId: order.id,
            },
            // automatic_payment_methods: {
            //     enabled: true,
            // },
        });
        client_secret = paymentIntent.client_secret ?? "";
    }

    return (
        <div>
            <OrderDetailsTable order={{
                ...order as any,
                shippingAddress: order.shippingAddress as any,
                }} 
                stripeClientSecret={client_secret}
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