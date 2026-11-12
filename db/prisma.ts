import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from "@/lib/generated/prisma/client"
import ws from 'ws';

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

// Instantiates the Prisma adapter using the provided connection string.
const adapter = new PrismaNeon({ connectionString });

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        needs: { price: true },
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        needs: { rating: true },
        compute(product) {
          return product.rating.toString();
        },
      },
    },
    cart: {
      itemsPrice: {
        needs: {itemsPrice: true},
        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: {shippingPrice: true},
        compute(cart) {
          return cart.shippingPrice.toString();
        },
      },
      totalPrice: {
        needs: {totalPrice: true},
        compute(cart) {
          return cart.totalPrice.toString();
        },
      },
      taxPrice: {
        needs: {taxPrice: true},
        compute(cart) {
          return cart.taxPrice.toString();
        },
      },
    },
     order: {
      itemsPrice: {
        needs: {itemsPrice: true},
        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: {shippingPrice: true},
        compute(cart) {
          return cart.shippingPrice.toString();
        },
      },
      totalPrice: {
        needs: {totalPrice: true},
        compute(cart) {
          return cart.totalPrice.toString();
        },
      },
      taxPrice: {
        needs: {taxPrice: true},
        compute(cart) {
          return cart.taxPrice.toString();
        },
      },
    },
     orderItem: {
      price: {
        needs: {price: true},
        compute(cart) {
          return cart.price.toString();
        },
      },
    },
  },
});
