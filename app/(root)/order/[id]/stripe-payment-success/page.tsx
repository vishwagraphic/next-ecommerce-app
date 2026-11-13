import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getOrderById } from '@/lib/actions/order.action';
import { notFound, redirect } from 'next/navigation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY ?? "");

const SuccessPage = async (props: { params: Promise<{ id: string }>, searchParams: Promise<{ payment_intent: string }> }) => {
    const {id} = await props.params;
    const {payment_intent: paymentIntentId} = await props.searchParams;

    const order = await getOrderById(id);

    if (!order) {
        notFound();
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.metadata.orderId === null || paymentIntent.metadata.orderId !== id) {
        notFound();
    }

    const isSuccessful = paymentIntent.status === 'succeeded' && paymentIntent.metadata.orderId === id;

    if (!isSuccessful) {
        redirect(`/order/${id}`);
    }
    
    return (
        <div className="max-w-4xl w-full mx-auto space-y-8">
        <div className="flex flex-col gap-6 items-center">
            <h1>Thanks for your payment!</h1>
            <p> We are processing your order and will send you an update shortly.</p>
            <Button>
                <Link href={`/order/${id}`}>View Order</Link>
            </Button>
        </div>
        </div>
    );
}

export default SuccessPage;