'use server'
import { prisma } from '@/db/prisma'
import { revalidatePath } from 'next/cache'
const PAGE_SIZE = process.env.PAGE_SIZE ? Number(process.env.PAGE_SIZE) : 2

import { convertToPlainObject, formatError } from "@/lib/utils";
import { insertCartSchema, insertProductSchema, updateProductSchema } from '../validators';
import { Prisma } from '../generated/prisma/browser';

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
    const product = await prisma.product.findFirst({
      where: { slug }
    })
    return convertToPlainObject(product)
  }

 export const getProductById = async (id: string) => {
    const product = await prisma.product.findFirst({
      where: { id }
    })
    return convertToPlainObject(product)
  }

  export const getAllProducts = async ({
    query,
    category,
    page = 1,
    price,
    rating,
    sort,
    limit = PAGE_SIZE
  }: {
    query?: string,
    category?: string,
    page?: number,
    price?: string,
    rating?: string,
    sort?: string,
    limit?: number
  }) => {
    const queryFilter:Prisma.ProductWhereInput = query && query !== 'all' ? 
    { name: { contains: query, mode: "insensitive" } as Prisma.StringFilter } : {}

    const categoryFilter:Prisma.ProductWhereInput = category && category !== 'all'  ? { category } : {}

    const priceFilter:Prisma.ProductWhereInput = price && price !== 'all' ? { price: { gte: Number(price.split('-')[0]), lte: Number(price.split('-')[1]) } } : {}

    const ratingFilter:Prisma.ProductWhereInput = rating && rating !== 'all' ? { rating: { gte: Number(rating) } } : {}
    
    const products = await prisma.product.findMany({
      where: {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: sort === 'lowest' ? 
        { price: "asc" } : sort === 'highest' ? { price: "desc" } : sort === 'rating' ? { rating: "desc" } : { created_at: "desc" }
    })

    const dataCount = await prisma.product.count()

    return {
      data: convertToPlainObject(products),
      totalPages: Math.ceil(dataCount / limit)
    }
   
  }

  export const deleteProduct = async (id: string) => {
    try {

      const productExists = await prisma.product.findUnique({
        where: { id }
      })
      if (!productExists) {
        throw new Error("Product not found")
      }
      const product = await prisma.product.delete({
        where: { id }
      })
      revalidatePath("/admin/products")
      return {success: true, message: "Product deleted successfully"}
    } catch (error) {
      console.error("Failed to delete product:", error)
      return {success: false, message: formatError(error)}
    }
   
    
  }

  export const createProduct = async (data: any) => {
    try {
      const product = insertProductSchema.parse(data)
      await prisma.product.create({
        data: product as any
      })
      revalidatePath("/admin/products")
      return {success: true, message: "Product created successfully"}
    } catch (error) {
      console.error("Failed to create product:", error)
      return {success: false, message: formatError(error)}
    }
  }
  
  export const updateProduct = async (id: string, data: any) => {
    try {
      const productData = updateProductSchema.parse(data)
      const productExists = await prisma.product.findFirst({
        where: { id }
      })
      if (!productExists) {
        throw new Error("Product not found")
      }
      await prisma.product.update({
        where: { id },
        data: productData as any
      })
      revalidatePath("/admin/products")
      return {success: true, message: "Product updated successfully"}
    } catch (error) {
      console.error("Failed to update product:", error)
      return {success: false, message: formatError(error)}
    }
  }

  export const getAllCategories = async () => {
    try {
      const categories = await prisma.product.groupBy({
       by: ["category"],
       _count: {
         category: true
       }
      })
      return {
        success: true,
        data: convertToPlainObject(categories)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      return {success: false, message: formatError(error)}
    }
  }

  export const getFeaturedProducts = async () => {
    try {
      const products = await prisma.product.findMany({
        where: { isFeatured: true },
        orderBy: { created_at: "desc" },
        take: 4
      })
      return convertToPlainObject(products)
    } catch (error) {
      console.error("Failed to fetch featured products:", error)
    }
  }