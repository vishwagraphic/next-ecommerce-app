'use server'

import { cookies } from "next/headers"
import { CartItem } from "@/types"
import { convertToPlainObject, formatError, round2 } from "../utils"
import { auth } from "@/auth"
import { prisma } from "@/db/prisma"
import { cartItemSchema, insertCartSchema } from "../validators"
import { revalidatePath } from "next/cache"

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 100),
    taxPrice = round2(itemsPrice * 0.15),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2)
}
};

export async function addItemToCart(data: CartItem) {
  // Implementation for adding item to cart
  try{
    const sessionCartId = (await cookies()).get("sessionCartId")?.value
    if (!sessionCartId) throw new Error("Session cart ID not found.")
    
  
    const session = await auth()
    const userid = session?.user?.id ? (session.user.id) as string : undefined

    const cart: any = await getMyCart()
    const item = cartItemSchema.parse(data)
   
    const product = await prisma.product.findFirst({
        where: { id: item.productId }
    })

    if (!product) throw new Error("Product not found.")
        
    const isEmpty = (cart:any) => Object.keys(cart).length === 0;

    console.log("IS EMPTY....", isEmpty(cart))
    if (isEmpty(cart)) {
        const newCart = insertCartSchema.parse({
            userId: userid ?? null,
            sessionCartId: sessionCartId,
            items: [item],
            ...calcPrice([item])
        })
        
        await prisma.cart.create({
            data: newCart as any
        })

        revalidatePath(`/product/${product.slug}`);
        revalidatePath("/cart");

        return {
            success: true,
            message: "Item added to cart successfully."
        }
    } else {
        const existItem = (cart.items as CartItem[]).find((i: CartItem) => i.productId === item.productId)
        
        console.log("existItem:", existItem)
        if(existItem) {
            // Implementation for updating existing item quantity
            if(product.stock < existItem.qty + item.qty) {
               throw new Error("Not enough stock available.")
            }

            (cart.items as CartItem[]).forEach((i: CartItem) => {
                if (i.productId === item.productId) {
                    i.qty += item.qty;
                }
            });
        } else {
            if (product.stock < 1) {
                throw new Error("Not enough stock available.")
            }
            (cart.items as CartItem[]).push(item)
        }

        
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: cart.items as CartItem[],
                ...calcPrice(cart.items as CartItem[])
            }
        })

        revalidatePath(`/product/${product.slug}`)
        revalidatePath("/cart")

        return {
            success: true,
            message: `${product.name} ${existItem ? "updated" : "added"} to cart.`
        }
    
    }
  } catch(error){
    return {
        success: false,
        message: formatError(error),
    }
  }

}

export async function getMyCart() {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value
    if (!sessionCartId) throw new Error("Session cart ID not found.")
    
    const session = await auth()
    const userid = session?.user?.id ? (session.user.id) as string : undefined


    // GET User cart from db
    const cart = await prisma.cart.findFirst({
        where: userid ? { userId: userid } : { sessionCartId: sessionCartId }
    })
    
    if (!cart) {
        // throw new Error("Cart not found.")
        return {}
    }

    return convertToPlainObject({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    }) 
}

export async function removeItemFromCart(productId: string) {
   try{
        const sessionCartId = (await cookies()).get("sessionCartId")?.value
        if (!sessionCartId) throw new Error("Session cart ID not found.")

        const product = await prisma.product.findFirst({
            where: { id: productId }
        })

        if (!product) throw new Error("Product not found.")

        const cart: any = await getMyCart()

        if(!cart.id) throw new Error("Cart not found.")

        const exist = (cart.items as CartItem[]).find((i: CartItem) => i.productId === productId)

        if (!exist) throw new Error("Item not found in cart.")

        if(exist.qty === 1) {
            cart.items = (cart.items as CartItem[]).filter((i: CartItem) => i.productId !== productId)
        } else {
            cart.items = (cart.items as CartItem[]).map((i: CartItem) => 
                i.productId === productId ? { ...i, qty: i.qty - 1 } : i
            )
        }

        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: cart.items as CartItem[],
                ...calcPrice(cart.items as CartItem[])
            }
        })

        revalidatePath(`/product/${product.slug}`)
        revalidatePath("/cart")

        return {
            success: true,
            message: `${product.name} removed from cart.`
        }
   } catch(error){
        return {
            success: false,
            message: formatError(error),
        }
   }
}