import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { insertReviewSchema } from "@/lib/validators";

const createReviewSchema = insertReviewSchema.omit({
  userId: true,
  isVerifiedPurchase: true,
});

export async function GET(request: Request) {
  const productId = new URL(request.url).searchParams.get("productId");

  if (!productId) {
    return Response.json({ message: "Product ID is required." }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true } } },
      orderBy: { created_at: "desc" },
    });

    return Response.json(reviews);
  } catch {
    return Response.json({ message: "Unable to load reviews." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return Response.json({ message: "Sign in to submit a review." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ message: parsed.error.issues[0]?.message ?? "Invalid review." }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: parsed.data.productId },
      select: { id: true },
    });

    if (!product) {
      return Response.json({ message: "Product not found." }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: { ...parsed.data, userId },
    });

    return Response.json(review, { status: 201 });
  } catch {
    return Response.json({ message: "Unable to submit review." }, { status: 500 });
  }
}