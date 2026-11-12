'use client'

import { Cart, CartItem } from "@/types"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Plus, Minus, Loader } from "lucide-react"
import { toast } from "sonner"
// import { toast, ToastDescription, ToastTitle } from "@/components/ui/toast"
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions"
import { useTransition } from "react"

export const AddCart = ({ item, cart }: { item: CartItem; cart?: any    }) => {
    const router = useRouter();

    const [isPending, startTransition] = useTransition()

    const handleAddToCart = async () => {

        startTransition(async () => {
            const res = await addItemToCart(item)

            if (!res?.success) {
            toast.error(<div className="bg-red-100 text-red-800 p-4 rounded-md">
                Failed to add item to cart.
            </div>)
            return
        }

        router.refresh()
        toast.success(`${item.name} added to cart.`, {
            action: {
                label: "Go to Cart",
                onClick: () => router.push("/cart"),
            },
        })
        })
        
    };

    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            const res = await removeItemFromCart(item.productId)
            if (res.success) {  
                router.refresh()
                toast.success(`${item.name} removed from cart.`, {
                    action: {
                        label: "Go to Cart",
                        onClick: () => router.push("/cart"),
                    },
                })
            } else {
                toast.error(<div className="bg-red-100 text-red-800 p-4 rounded-md">
                    Failed to remove item from cart.
                </div>)
            }
        })
    }

    const existItem = cart && cart?.items?.find((i:any) => i.productId === item.productId)

    return (

        <div>
            {existItem ? (
                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={handleRemoveFromCart}>
                        {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Minus className="h-4 w-4" />}   
                    </Button>
                    <span>{existItem.qty}</span>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddToCart}>
                        {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    </Button>
                </div>
            ) : (
                <Button className="w-full" type="button" onClick={handleAddToCart}>
                   {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Add to Cart
                </Button>
            )}
        </div>
    )
}

export default AddCart
