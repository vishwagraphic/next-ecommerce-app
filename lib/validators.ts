import {z} from 'zod'
import { formatNumberWithDecimals } from './utils';

const currency = z.string().refine((val) => /^\d+(\.\d{1,2})?$/.test(formatNumberWithDecimals(parseFloat(val))), 'Invalid currency format');

export const insertProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  slug: z.string().min(3, 'Slug must be at least 3 characters long'),
  category: z.string().min(3, 'Category must be at least 3 characters long'),
  brand: z.string().min(3, 'Brand must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long').optional(),
  stock: z.coerce.number().nonnegative(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  isFeatured: z.boolean(),
  banner: z.string().optional(),
  price: currency
})