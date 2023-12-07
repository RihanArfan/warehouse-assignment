import type { Customer } from "types";

export const useCustomers = () => {
  return useState<Customer[]>("customers", () => []);
};
