export { cn } from "cn"

export const convertToPlainObject = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};

export const formatNumberWithDecimals = (value: number) => {
    const [integer, decimal] = value.toString().split('.');
    return decimal ? `${integer}.${decimal.slice(0, 2)}` : `${integer}.00`;
};