import {z} from 'zod'
import {insertProductSchema, insertCartSchema, cartItemSchema, shippingAddressSchema, insertOrderSchema, insertOrderItemSchema, paymentResultSchema, insertReviewSchema } from '@/lib/validators'

export type Product = z.infer<typeof insertProductSchema> & {
    id: string
    numReviews: number
    rating: number
    createdAt: Date
}

export type Cart = z.infer<typeof insertCartSchema> 

export type CartItem = z.infer<typeof cartItemSchema>   

export type ShippingAddress = z.infer<typeof shippingAddressSchema>

export type Order = z.infer<typeof insertOrderSchema> & {
    id: string
    created_at: Date
    isPaid: boolean
    paid_at: Date | null
    isDelivered: boolean
    delivered_at: Date | null
    orderItems: OrderItem[]
    user: {name: string, email: string}
}

export type OrderItem = z.infer<typeof insertOrderItemSchema>

export type PaymentResult = z.infer<typeof paymentResultSchema>

export type Review = z.infer<typeof insertReviewSchema> & {
    id: string
    created_at: Date
    user?: {name: string}
}