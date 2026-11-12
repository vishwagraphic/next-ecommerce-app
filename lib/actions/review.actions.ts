'use server';

import { insertReviewSchema } from "../validators";
import z from "zod";
import {formatError} from "../utils";
import { prisma } from "@/db/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";



export const createUpdateReview = async (data: z.infer<typeof insertReviewSchema>) => {
    try {
    const session = await auth();
    if (!session) {
      throw new Error("User not authenticated");
    }
    const userId = session?.user?.id;
    const review = await insertReviewSchema.parse({
      ...data,
      userId,
    });

    const proeuct = await prisma.product.findFirst({
      where: { id: review.productId },
    });

    if (!proeuct) {
      throw new Error("Product not found");
    }

    const reviewEsist = await prisma.review.findFirst({
      where: { userId, productId: review.productId },
    });
    await prisma.$transaction(async (tx) => {
      if (reviewEsist) {
        await tx.review.update({
          where: { id: reviewEsist?.id },
          data: {
            title: review.title,
            description : review.description,
            rating: review.rating,
          },
        });
      } else {
        await tx.review.create({
          data: review,
        });
      }

       const averageRating = await tx.review.aggregate({
        where: { productId: review.productId },
        _avg: { rating: true },
        });
        const numReviews = await tx.review.count({
          where: { productId: review.productId },
        });

        await tx.product.update({
          where: { id: review.productId },
          data: {
            rating: averageRating._avg.rating ?? 0,
            numReviews,
          },
        });
    });
    revalidatePath(`/product/${proeuct.slug}`);
     
      return {success: true, message: "Review updated successfully"}
    } catch (error) {
      console.error("Failed to add review:", error)
      return {success: false, message: formatError(error)}
    }
   
    
  }

  export const getReviews = async (productId: string) => {
    try {
      const reviews = await prisma.review.findMany({
        where: { productId },
        include: { user: { select: { name: true } } },
        orderBy: { created_at: 'desc' },
      });
      return { success: true, data: reviews };
    } catch (error) {
      console.error("Failed to get reviews:", error);
      return { success: false, message: formatError(error) };
    }
  };

  export const getReviewByProductId = async (productId: string) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }
    const userId = session?.user?.id;
    try {
      const review = await prisma.review.findFirst({
        where: { productId, userId }
      });
      return { success: true, data: review };
    } catch (error) {
      console.error("Failed to get review by product and user:", error);
      return { success: false, message: formatError(error) };
    }
  };