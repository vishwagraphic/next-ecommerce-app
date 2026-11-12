'use server'

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { PaymentResult } from "@/types";
import {paypal} from "../paypal";
import { revalidatePath } from "next/cache";
import {PAGE_SIZE} from "@/lib/constants";
import type { Prisma } from "@/lib/generated/prisma/client";

type SalesDataType = {
    month: string;
    totalSales: number;
}[];

export async function createOrder() {
    try{
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("User not authenticated");
        }

        const cart = await getMyCart() as any;
        const userId = session?.user?.id;
        if (!userId) {
            throw new Error("User not found");
        }
        if (!Array.isArray(cart?.items) || cart.items.length === 0) {
            return {success: false, error: "Cart is empty", redirect: "/cart"};
        }

        const user = await getUserById(userId);
        if (!user.address) {
            return {success: false, error: "User address not found", redirect: "/shipping-address"};
        }
        
        if(!user.paymentMethod) {
            return {success: false, error: "User payment method not found", redirect: "/payment-method"};
        }

        const order = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: [user.address],
            paymentMethod: { type: user.paymentMethod },
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
            items: cart.items,
        });
        const { items, shippingAddress, paymentMethod, ...orderData } = order;

        const insertedOrderId = await prisma.$transaction(async (tx) => {
            const insertedOrder = await tx.order.create({
                data: {
                    ...orderData,
                    shippingAddress,
                    paymentMethod: paymentMethod.type,
                } as any,
            });

            for (const item of items) {
                await tx.orderItem.create({
                    data: {
                        ...item,
                        price: item.price,
                        orderId: insertedOrder.id,
                    },
                });
            }
            console.log("Inserted order:", cart.id);
            await tx.cart.update({
                where: { id: cart.id },
                data: { 
                    items: [],
                    itemsPrice: 0,
                    shippingPrice: 0,
                    taxPrice: 0,
                    totalPrice: 0,
                },
            });
            return insertedOrder.id;
        });
        console.log("Inserted order ID:", insertedOrderId);
        if(!insertedOrderId) {
            throw new Error("Order creation failed");
        }
        return {success: true, orderId: insertedOrderId, redirectTo: "/order/" + insertedOrderId};
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        console.error("Failed to create order:", error);
        return {success: false, error: formatError((error as Error))};
    }

}

export async function getOrderById(orderId: string) {
    try {
        console.log("Fetching order with ID:", orderId);
        const order = await prisma.order.findFirst({
            where: { id: orderId },
            include: {
                orderitems: true,
                user: { select: { name: true, email: true } },
            },
        });
        console.log("Fetched order:", order);
        return order ? convertToPlainObject(order) : null;
    } catch (error) {
        console.error("Error fetching order:", error);
        throw new Error(formatError((error as Error)));
    }
}

export async function paypalOrder(orderId: string) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId },
        });
        if (!order) {
            throw new Error("Order not found");
        }
        const paypalOrder = await paypal.createOrder(Number(order.totalPrice));
        
        await prisma.order.update({
            where: { id: orderId },
            data: { 
                paymentResult:{
                    id: paypalOrder.id,
                    status: '',
                    pricePaid: 0
                }
             },
        });
        return {success: true, message: "PayPal order created successfully", data: paypalOrder.id};
    } catch (error) {
        return {success: false, error: formatError((error as Error))};
    }       
}

export async function approvePaypalOrder(orderId: string, data: {orderId: string}) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId },
        });
        if (!order) {
            throw new Error("Order not found");
        }
        if (order.isPaid) {
            throw new Error("Order is already paid");
        }
        const paypalOrderId = (order.paymentResult as PaymentResult | null)?.id;
        if (!paypalOrderId || data.orderId !== paypalOrderId) {
            throw new Error("PayPal order does not match this order");
        }

        const capture = await paypal.capturePayment(data.orderId);
        const captureDetails = capture.purchase_units?.[0]?.payments?.captures?.[0];
        if (capture?.id !== paypalOrderId || capture.status !== 'COMPLETED' || !captureDetails) {
            throw new Error("PayPal payment was not completed");
        }
        const status = await updateOrderStatus(orderId, {
            id: capture.id,
            status: capture.status,
            email_address: capture.payer?.email_address ?? "unknown",
            pricePaid: captureDetails.amount.value,
        });
        if (!status.success) {
            throw new Error(status.error);
        }

        revalidatePath(`/order/${orderId}`);
        return {success: true, message: "PayPal order approved successfully", data: capture};
    } catch (error) {
        return {success: false, error: formatError((error as Error))};
    }
}

async function updateOrderStatus(orderId: string, paymentResult?: PaymentResult) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId },
            include: {
                orderitems: true
            }
        });
        if (!order) {
            throw new Error("Order not found");
        }

        if(order.isPaid) {
            throw new Error("Order is already paid");
        }

        await prisma.$transaction(async (tx) => {
            for (const item of order.orderitems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.qty } }
                });
            }
            await tx.order.update({
                where: { id: orderId },
                data: { isPaid: true, paid_at: new Date(), paymentResult },
            });
        });
        return {success: true, message: "Order status updated successfully"};
    } catch (error) {
        return {success: false, error: formatError((error as Error))};
    }
}

export async function getMyOrders({limit = PAGE_SIZE, page = 1}: {limit?: number, page?: number}) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("User not authenticated");
        }
        const userId = session.user.id;
        const skip = (page - 1) * limit;
        const orders = await prisma.order.findMany({
            where: { userId },
            orderBy: { created_at: 'desc' },
            skip,
            take: limit,
            include: {
                orderitems: true
            }
        });

        const dataCount = await prisma.order.count({
            where: { userId }
        });
        return {orders, totalPages: Math.ceil(dataCount / limit), currentPage: page};
    } catch (error) {
        return {success: false, error: formatError((error as Error))};
    }
}   


export async function getOrderSummary() {
    try {
        const totalOrders = await prisma.order.count();
        const totalUsers = await prisma.user.count();
        const totalProducts = await prisma.product.count();

        const totalSales = await prisma.order.aggregate({
            _sum: { totalPrice: true }
        });
        
        const salesDataRaw = await prisma.$queryRaw<Array<{ month: Date, totalSales: Prisma.Decimal }>>`
            SELECT DATE_TRUNC('month', "created_at") AS "month", SUM("totalPrice") AS "totalSales"
            FROM "Order"
            GROUP BY DATE_TRUNC('month', "created_at")
            ORDER BY "month" ASC
        `;

        const monthlySales: SalesDataType = salesDataRaw.map((sale) => ({
            month: sale.month.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
            totalSales: Number(sale.totalSales),
        }));

        
        const latestSale = await prisma.order.findMany({
            orderBy: { created_at: 'desc' },
            include: { 
                user: { select: { name: true } },
             },
            take: 6
        });

       
        return {
            totalOrders,
            totalSales: totalSales._sum.totalPrice || 0,
            totalUsers,
            totalProducts,
            salesData: monthlySales,
            latestSale: convertToPlainObject(latestSale)
        };
    } catch (error) {
        return {success: false, error: formatError((error as Error))};
    }
}

export const getAllOrders = async ({ page = 1, limit = PAGE_SIZE, query}: {page?: number, limit?: number, query?: string}) => {
    const queryFilter = query && query !== "all" ? { 
        user: { name: { contains: query, mode: "insensitive" } as Prisma.StringFilter }
    } : {};
    try {
        const skip = (page - 1) * limit;
        const data = await prisma.order.findMany({
            where: {
                ...queryFilter
            },
            orderBy: { created_at: 'desc' },
            skip,
            take: limit,
            include: {
                orderitems: true,
                user: { select: { name: true } }
            }
        });

        const dataCount = await prisma.order.count();
        return {data, totalPages: Math.ceil(dataCount / limit), currentPage: page};
    } catch (error) {
        return {success: false, error: formatError((error as Error))};
    }
};

export const deleteOrder = async (orderId: string) => {
    try {
        const deletedOrder = await prisma.order.delete({
            where: { id: orderId }
        });
        revalidatePath("/admin/orders");
        return {success: true, data: deletedOrder};
    } catch (error) {
        return {success: false, error: formatError((error as Error))};
    }
};

export const updateOrdertoPaidCOD = async (orderId: string) => {
    try {
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { isPaid: true, paid_at: new Date() }
        });
        revalidatePath(`/admin/orders`);
        return {success: true, message: "Cash on delivery order marked as paid", data: updatedOrder};
    } catch (error) {
        return {success: false, error: formatError((error as Error))};
    }
};

export const deliverOrder = async (orderId: string) => {
    try {
        const deliveredOrder = await prisma.order.findFirst({
            where: { id: orderId }
        });
        if (!deliveredOrder) {
            throw new Error("Order not found");
        }
        if (deliveredOrder.isDelivered) {
            throw new Error("Order is already marked as delivered");
        }
        if (!deliveredOrder.isPaid) {
            throw new Error("Order cannot be marked as delivered before it is paid");
        }
        await prisma.order.update({
            where: { id: orderId },
            data: { isDelivered: true, delivered_at: new Date() }
        });
        revalidatePath(`/admin/orders`);
        return {success: true, message: "Order marked as delivered", data: deliveredOrder};
    } catch (error) {
        return {success: false, error: formatError((error as Error))};
    }
};