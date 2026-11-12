export { cn } from "cn"

export const convertToPlainObject = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};

export const formatNumberWithDecimals = (value: number) => {
    const [integer, decimal] = value.toString().split('.');
    return decimal ? `${integer}.${decimal.slice(0, 2)}` : `${integer}.00`;
};

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

export const formatNumber = (value: number) => {
  return NUMBER_FORMATTER.format(value);
};

type FormattedErrorDetails = {
  name?: unknown;
  code?: unknown;
  issues?: { message: string }[];
  cause?: { kind?: unknown };
  meta?: { target?: unknown; driverAdapterError?: unknown };
};

export const formatError = (error: unknown) => {
  const errorDetails: FormattedErrorDetails =
    typeof error === "object" && error !== null ? error : {};
  const driverAdapterError = errorDetails.meta?.driverAdapterError;
  const adapterErrorDetails: FormattedErrorDetails =
    typeof driverAdapterError === "object" && driverAdapterError !== null
      ? driverAdapterError
      : errorDetails;

  if (errorDetails.name === "ZodError" && Array.isArray(errorDetails.issues)) {
    return errorDetails.issues.map((issue) => issue.message).join(", ");
  } else if (
    adapterErrorDetails.name === "DriverAdapterError" &&
    adapterErrorDetails.cause?.kind === "UniqueConstraintViolation"
  ) {
    return "An account with this email already exists.";
  } else if (errorDetails.name === "PrismaClientKnownRequestError" && errorDetails.code === "P2002") {
    const target = errorDetails.meta?.target;
    const field = Array.isArray(target) && typeof target[0] === "string" ? target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }
  return "An unknown error occurred";
};

export function round2(value: number | string) {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return Math.round((numValue + Number.EPSILON) * 100) / 100;
}


const CURRENCY_FORMATTER = new Intl.NumberFormat('en-Us', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2
})

export function formatCurrency(amount: number | string | null) {
  if(typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  } else if(typeof amount === "string") {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount)) {
      return CURRENCY_FORMATTER.format(numAmount);
    }
  }
  return "Invalid amount";
}

export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
} 