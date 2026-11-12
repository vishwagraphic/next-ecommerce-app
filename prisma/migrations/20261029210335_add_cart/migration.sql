/*
  Warnings:

  - You are about to drop the column `ShippingPrice` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `TaxPrice` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `TotalPrice` on the `Cart` table. All the data in the column will be lost.
  - Added the required column `shippingPrice` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxPrice` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "ShippingPrice",
DROP COLUMN "TaxPrice",
DROP COLUMN "TotalPrice",
ADD COLUMN     "shippingPrice" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "taxPrice" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "totalPrice" DECIMAL(12,2) NOT NULL;
