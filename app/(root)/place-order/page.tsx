import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/product/checkout-steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { Cart, CartItem, ShippingAddress } from "@/types";
import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import PlaceOrderForm from "./place-order-form";


export const metadata: Metadata = {
    title: "Place Order",
};

const PlaceOrderPage = async () => {
    const cart = await getMyCart() as any;
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("User not found");
    }

    const user = await getUserById(userId);

    if(!cart || cart?.items?.length === 0) {
        redirect("/cart");
    }

    if(!user.address) {
        redirect("/shipping-address");
    }

    if(!user.paymentMethod) {
        redirect("/payment-method");
    }

    const userAddress = user.address as ShippingAddress;
    const userPaymentMethod = user.paymentMethod;


    return ( <>
    <CheckoutSteps currentStep={3} >
    </CheckoutSteps>
    <h1 className="text-2xl py-4">Place Order</h1>
    <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
            <Card>
                <CardContent className="p-4 gap-4">
                    <h2 className="text-lg font-bold mb-2">Shipping Address</h2>
                    <p>{userAddress.fullName}</p>
                    <p>{userAddress.streetAddress}, {userAddress.city}{' '}</p>
                    <p>{userAddress.postalCode}, {userAddress.country}{' '}</p>
                    <div className="mt-3">
                        <Link href="/shipping-address">
                            <Button variant="outline">
                                Edit
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
           
            <Card>
                <CardContent className="p-4 gap-4">
                    <h2 className="text-lg font-bold mb-2">Payment Method</h2>
                    <p>{user.paymentMethod}</p>
                    <div className="mt-3">
                        <Link href="/payment-method">
                            <Button variant="outline">
                                Edit
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
            
           
            <Card>
                <CardContent className="p-4 gap-4">
                    <h2 className="text-lg font-bold mb-2">Order Summary</h2>
                    <Table>
                        <TableHeader>
                           <TableRow>
                               <TableHead>
                                   Item
                               </TableHead>
                               <TableHead>
                                   Quantity
                               </TableHead>
                               <TableHead>
                                   Price
                               </TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cart.items.map((item: CartItem) => {
                                
                                return (
                                    <TableRow key={item.slug}>
                                    <TableCell>
                                        <Link href={`/product/${item.slug}`} className="flex items-center">
                                            <Image src={item.image} alt={item.name} width={50} height={50} />
                                            <span className="px-2">{item.name}</span>
                                        </Link>
                                    </TableCell>
                                    <TableCell>{item.qty}</TableCell>
                                    <TableCell>{item.price}</TableCell>
                                </TableRow>
                            )})}
                            {}
                            {/* Render your table rows here */}
                        </TableBody>
                    </Table>
                    </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardContent className="p-4 gap-4">
                  <div className="flex justify-between">
                    <span className="font-bold">Items</span>
                    <span className="font-bold">{formatCurrency(cart.itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Tax</span>
                    <span className="font-bold">{formatCurrency(cart.taxPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Shipping</span>
                    <span className="font-bold">{formatCurrency(cart.shippingPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">{formatCurrency(cart.totalPrice)}</span>
                  </div>
                  <PlaceOrderForm />
                </CardContent>
            </Card> 
        </div>
    </div>
    </> );
}
 
export default PlaceOrderPage;