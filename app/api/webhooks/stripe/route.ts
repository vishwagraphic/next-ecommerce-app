import { NextResponse, NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";

import {updateOrderStatus} from "@/lib/actions/order.action";


export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") ?? "";

    let event;

    try {
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET ?? ""
        );
    } catch (err) {
        return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
    }

    if (event.type !== "payment_intent.succeeded") {
        return NextResponse.json({ received: true });
    }

    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    if (!orderId) {
        return NextResponse.json({ received: true, ignored: true });
    }

    const result = await updateOrderStatus(orderId, {
        id: paymentIntent.id,
        status: paymentIntent.status,
        email_address: paymentIntent.receipt_email ?? "unknown",
        pricePaid: (paymentIntent.amount_received / 100).toFixed(2),
    });

    if (!result.success) {
        console.error("Failed to update order from Stripe webhook:", result.error);
        return NextResponse.json({ received: false }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}