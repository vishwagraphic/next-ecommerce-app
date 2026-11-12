import {auth} from '@/auth'
import {getMyCart} from '@/lib/actions/cart.actions'
import { Metadata } from "next";
import {redirect} from 'next/navigation'
import {ShippingAddress} from '@/types'
import { getUserById } from '@/lib/actions/user.actions';
import ShippingAddressForm from './shipping-address';
import CheckoutSteps from '@/components/shared/product/checkout-steps';

export const metadata: Metadata = {
    title: 'Shipping Address',
    description: 'Enter your shipping address for the order',
}
const ShippingAddressPage = async () => {
    const cart:any = await getMyCart()
    if (!cart || cart?.items?.length === 0) {
        redirect('/cart')
    }
    const session = await auth()
    
    const userId = session?.user?.id
    if (!userId) {
        throw new Error('User ID is not available in the session. Please sign in to continue.')
    }
    const user = await getUserById(userId)
    if (!user) {
        throw new Error('User not found. Please sign in to continue.')
    }
    return ( 
        <>
            <CheckoutSteps currentStep={1} />
            <ShippingAddressForm address={user.address as any} />
        </>
    );
}
 
export default ShippingAddressPage;