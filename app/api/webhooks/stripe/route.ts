import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY ?? "");

import {updateOrderStatus} from "@/lib/actions/order.action";
import { metadata } from "@/app/layout";


export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") ?? "";

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET ?? ""
        );
    } catch (err) {
        return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
    }

    if (event.type === "charge.succeeded") {
        const {object} = event.data;
        const orderId = object.metadata.id;
        if (orderId) {
            await updateOrderStatus(
                orderId,
                {
                    id: object.id,
                    status: object.status,
                    email_address: object.billing_details?.email ?? "unknown",
                    pricePaid: (object.amount / 100).toFixed(2),
                }
            );
        }
        return new NextResponse("Received", { status: 200 });
    }

    return new NextResponse("Not Received", { status: 200 });
}