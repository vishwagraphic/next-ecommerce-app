import {loadStripe} from '@stripe/stripe-js';
import {Elements, PaymentElement, useStripe, useElements, LinkAuthenticationElement} from '@stripe/react-stripe-js';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const StripePayment = ({priceinCents, orderId, stripeClientSecret}: {priceinCents: number, orderId: string, stripeClientSecret: string}) => {
    const StripePaymentForm = () => {
        return stripeForm();
    };
    const {theme, systemTheme} = useTheme();

    if (!publishableKey) {
        return <p role="alert">Stripe is not configured. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and rebuild.</p>;
    }

    const stripeForm = () => {
        const stripe = useStripe();
        const elements = useElements();

        const [isLoading, setIsLoading] = useState(false);
        const [errorMEssage, setErrorMEssage] = useState('');
        const [email, setEmail] = useState('');

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!stripe || !elements) return;
            setIsLoading(true);
            setErrorMEssage('');
            const result = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order/${orderId}/stripe-payment-success`,
                    receipt_email: email,
                },
            });
            if (result.error) {
                setErrorMEssage(result.error.message ?? 'An error occurred');
            }
            setIsLoading(false);
        };

        return (
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="text-xl">Stripe Checkout</div>
                {errorMEssage && <div className="text-red-500">{errorMEssage}</div>}
                
                 <PaymentElement />
                 <div>
                    <LinkAuthenticationElement onChange={e => setEmail(e?.value?.email  )} />
                 </div>
                 <Button className="w-full" size="lg" type="submit" disabled={stripe == null || elements == null || isLoading}>
                     {isLoading ? 'Processing...' : `Pay Now ${formatCurrency(priceinCents / 100)}`}
                 </Button>
            </form>
        )

    }

    return (
        <div>
            <Elements stripe={stripePromise} options={{
                clientSecret: stripeClientSecret,
                appearance: {theme: theme === 'dark' ? 'night' : theme === 'light' ? 'stripe' : systemTheme === 'light' ? 'stripe' : 'night' },
                }}>
                <StripePaymentForm />
            </Elements>
        </div>
    );
};

export default StripePayment;