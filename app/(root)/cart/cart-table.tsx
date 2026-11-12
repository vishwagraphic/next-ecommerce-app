'use client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions'
import { ArrowRight, Loader, Loader2, Minus, Plus } from 'lucide-react'

import { Cart } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import {Table, TableBody, TableHead, TableHeader, TableRow, TableCell} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import {formatCurrency} from '@/lib/utils'

export default function cartTable({ cart }: { cart?: Cart }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()


  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart?.items?.length === 0 ? (
        <p className="text-muted-foreground">
          Your cart is empty. <Link href="/products" className="text-primary hover:underline">
            Continue shopping
          </Link>
        </p>
      ) : ( 
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                    </TableRow>
                    {cart?.items?.map((item) => (
                        <TableRow key={item.slug}>
                            <TableCell>
                                <Link href={`/products/${item.slug}`} className="flex items-center gap-2">
                                    <Image src={item.image} alt={item.name} width={50} height={50} />
                                    {item.name}
                                </Link>
                            </TableCell>
                            <TableCell className="flex items-center gap-2">
                                <Button
                                    disabled={isPending}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        startTransition(async () => {
                                            const res = await removeItemFromCart(item.productId)
                                            if (!res.success){
                                                toast.error('Failed to remove item from cart')
                                            } else {
                                                toast.success('Item removed from cart')
                                            }
                                        })
                                    }}
                                >
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Minus className="h-4 w-4" />}  
                                </Button>
                                {item.qty}
                                <Button
                                    disabled={isPending}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        startTransition(async () => {
                                            const res = await addItemToCart(item)
                                            if (!res.success){
                                                toast.error('Failed to add item to cart')
                                            } else {
                                                toast.success('Item added to cart')
                                            }
                                        })
                                    }}
                                >
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}      
                                </Button>
                            </TableCell>
                            <TableCell>${item.price}</TableCell>
                            
                        </TableRow>
                    ))}
                </TableHeader>
            </Table>
          </div>
          <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="pb-3 text-xl">Subtotal ({
                        cart?.items?.reduce((total, item) => total + (item.qty), 0) 
                        })
                        <span className="font-bold">{" " + formatCurrency(cart?.itemsPrice)}</span>
                        </div>
                        <Button
                        className="w-full"
                        disabled={isPending}
                        onClick={() => {
                            startTransition( () => {
                                router.push('/shipping-address')
                            })
                        }}
                        >
                            {
                                isPending ? (
                                    <Loader className="w-4 h-4" />
                                ) :
                                (
                                    <ArrowRight className="w-4 h-4" />
                                )
                            }{' '} Proceed to checkout

                        </Button>
                        

                </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
