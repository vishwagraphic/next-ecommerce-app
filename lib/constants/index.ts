export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Prostore";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Modelr ecommerce store built with next js";
export const APP_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const LATEST_PRODUCTS_LIMIT = Number(process.env.NEXT_PUBLIC_LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: "vishwa.graphic@gmail.com",
  password: "Trichy@123"
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
};

export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: ""
}

export const PAYMENT_METHODS = (process.env.PAYMENT_METHODS?.split(",") || ["PayPal", "Stripe", "CashOnDelivery"])
  .map((method) => method.trim())
  .filter(Boolean);
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || "PayPal";

export const PAGE_SIZE:number = Number(process.env.PAGE_SIZE) || 1;

export const productDefaultValues = {
  name: "",
  slug: "",
  category: "",
  brand: "",
  description: "",
  stock: 0,
  images: [] as string[],
  price:0,
  rating: 0,
  numReviews: 0,
  isFeatured: false,
  banner: null
}

export const user_roles = process.env.USER_ROLES?.split(",") || ["user", "admin"];

export const reviewDefaultValues = {
  title: "",
  description: '',
  rating: 0,
} 