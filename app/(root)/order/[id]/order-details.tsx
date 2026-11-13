'use client';
import {Order, ShippingAddress} from '@/types';
import {formatId} from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer} from '@paypal/react-paypal-js';
import {paypalOrder, approvePaypalOrder, updateOrdertoPaidCOD, deliverOrder} from '@/lib/actions/order.action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { Button } from '@/components/ui/button';
import StripePayment from './stripe-payment';

const OrderDetailsTable = ({order, stripeClientSecret, paypalClientId, isAdmin}: {order: Order, stripeClientSecret: string, paypalClientId: string, isAdmin: boolean}) => {
    const router = useRouter();

    const { 
        id,
        shippingAddress,
        paymentMethod,
        isDelivered,
        isPaid,
        paid_at,
        delivered_at
    } =  order;

    console.log("METHODDD", paymentMethod);
    const address = shippingAddress[0];

    const handleCreateOrder = async () => {
        const response = await paypalOrder(id);

        if (!response.data) {
            toast.error(`${response.message}`);
        }
        return response.data;
    };

    console.log("PLLLLLLL", isAdmin, isPaid, paymentMethod);
    const MarkAsPaidButton = ({orderId}: {orderId: string}) => {
        const [isPending, setIsPending] = useState(false);
        const handleMarkAsPaid = async () => {
            startTransition(async () => {
               setIsPending(true);
                const response = await updateOrdertoPaidCOD(orderId);
                setIsPending(false);
                if (response.success) {
                    toast.success(response.message);
                    router.refresh();
                } else {
                    toast.error(response.error);
                }
            });
            
        };
        return (
            <Button onClick={handleMarkAsPaid} className="btn btn-primary" type="button" disabled={isPending}>
                {isPending ? "Marking as Paid..." : "Mark as Paid"}
            </Button>
        );
    };

    const MarkAsDeliveredButton = ({orderId}: {orderId: string}) => {
        const [isPending, setIsPending] = useState(false);
        const handleMarkAsDelivered = async () => {
            startTransition(async () => {
               setIsPending(true);
                const response = await deliverOrder(orderId);
                setIsPending(false);
                if (response.success) {
                    toast.success(response.message);
                    router.refresh();
                } else {
                    toast.error(response.error);
                }
            });
            
        };
        return (
            <Button onClick={handleMarkAsDelivered} className="btn btn-primary" type="button" disabled={isPending}>
                {isPending ? "Marking as Delivered..." : "Mark as Delivered"}
            </Button>
        );
    };

    const handleApproveOrder = async (data: {orderID: string}) => {
        const response = await approvePaypalOrder(order.id, {orderId: data.orderID});

        if (response.success) {
            toast.success(response.message);
            router.refresh();
        } else {
            toast.error(response.error);
        }
    }

    const PrintLoadingState = () => {  
        const [{isPending, isRejected}] = usePayPalScriptReducer();
        return (
            <div>
                {isPending && <p>Loading...</p>}
                {isRejected && <p>Error loading PayPal script</p>}
            </div>
        );
    }

    console.log("Payment Method Type:", paymentMethod)
    
    return (
        <div>
            <h1>Order {formatId(id)}</h1>
            <div className="grid md:md:grid-cols-3 md:gap-5">
                <div className="md:col-span-1 space-4-y overflow-x-auto">
                    <Card>
                        <CardContent>
                            <h2 className="text-xl pb-4">Payment Method</h2>
                            <p>{paymentMethod as any}</p>
                            {isPaid ? <Badge variant="secondary">Paid at: {paid_at ? new Date(String(paid_at)).toLocaleString() : ""}</Badge> : <Badge variant="destructive">Not paid yet</Badge>}
                            <h2 className="text-xl pb-4">Shipping Address</h2>
                            <p>{address?.fullName}</p>
                            <p>{address?.streetAddress}</p>
                            <p>{address?.city}, {address?.postalCode}</p>
                            <p>{address?.country}</p>
                            {isDelivered ? <p>Delivered at: {delivered_at ? new Date(String(delivered_at)).toLocaleString() : ""}</p> : <p>Not delivered yet</p>}
                            {/* Order details content goes here */}
                            {!isPaid && paymentMethod as any === 'PayPal' && (
                                paypalClientId ? (
                                    <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                                        <PrintLoadingState />
                                        <PayPalButtons
                                            createOrder={handleCreateOrder}
                                            onApprove={handleApproveOrder}
                                        />
                                    </PayPalScriptProvider>
                                ) : (
                                    <p role="alert">PayPal is not configured. Set PAYPAL_CLIENT_ID in the server environment.</p>
                                )
                            )}

                            {!isPaid && paymentMethod as any === 'Stripe' && stripeClientSecret && (
                                <StripePayment
                                    priceinCents={Number(order.totalPrice) * 100}
                                    orderId={order.id}
                                    stripeClientSecret={stripeClientSecret}
                                />
                            )}

                            {
                                isAdmin && !isPaid && paymentMethod as any === 'CashOnDelivery' && (
                                   <MarkAsPaidButton orderId={id} />
                                )
                            }
                            {
                                isAdmin && !isDelivered && isPaid && (
                                    <MarkAsDeliveredButton orderId={id} />
                                )   
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>
            
        </div>
    );
}
 
export default OrderDetailsTable;