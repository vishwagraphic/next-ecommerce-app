import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../lib/generated/prisma/client"
import sampleData from './sample-data'




const main = async () => {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to seed the database")
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  })

  try {
    await prisma.product.deleteMany()
    await prisma.product.createMany({
      data: sampleData.products,
    })
    console.log("Sample data inserted successfully")
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })