import {z} from 'zod'
import { formatNumberWithDecimals } from './utils';
import { PAYMENT_METHODS } from './constants';

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

export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, 'Product ID is required')
});


export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})

export const signUpSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters long')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})


export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  qty: z.number().nonnegative('Quantity must be a positive number'),
  image: z.string().min(1, 'Image is required'),
  price: currency
})

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, 'Session Cart ID is required'),
  userId: z.string().optional().nullable()
})

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Name must be atleast 3 characters'),
  streetAddress: z.string().min(3, 'Street address must be atleast 3 characters'),
  city: z.string().min(3, 'City must be atleast 3 characters'),
  postalCode: z.string().min(3, 'Postal code must be atleast 3 characters'),
  country: z.string().min(3, 'country must be atleast 3 characters'),
  lat: z.number().optional(),
  long: z.number().optional()
})

export const paymentMethodSchema = z.object({
  type: z.string().min(1, 'Payment method is required')
}).refine((data) => PAYMENT_METHODS.includes(data.type), {
  message: "Invalid payment method",
  path: ["type"]
})

export const insertOrderSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  shippingAddress: z.array(shippingAddressSchema),
  paymentMethod: paymentMethodSchema,
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  items: z.array(cartItemSchema)
})

export const insertOrderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  qty: z.number().nonnegative('Quantity must be a positive number'),
  price: currency,
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  image: z.string().min(1, 'Image is required')
})

export const paymentResultSchema = z.object({
  id: z.string().min(1, 'Order ID is required'),
  status: z.string().min(1, 'Status is required'),
  email_address: z.string().min(1, 'Email is required'),
  // paymentTime: z.string().min(1, 'Payment time is required'),
  pricePaid: z.string().min(1, 'Price paid is required')
})

export const updateProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
})

export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, 'User ID is required'),
  role: z.enum(['user', 'admin']).optional()
})