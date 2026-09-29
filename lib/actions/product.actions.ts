'use server'
import { prisma } from '@/sample-data/db/prisma'

import { convertToPlainObject } from "@/lib/utils";


 const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to seed the database")
  }

  export const getLatestProducts = async () => {
    const products = await prisma.product.findMany({
        take: 4,
        orderBy: { created_at: "desc" }
    })
    return convertToPlainObject(products)
  }

  export const getProductBySlug = async (slug: string) => {
    const product = await prisma.product.findUnique({
      where: { slug }
    })
    return convertToPlainObject(product)
  }