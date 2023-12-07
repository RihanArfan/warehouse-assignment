import type { Supplier } from "types";

export const useSuppliers = () => {
  return useState<Omit<Supplier, "users">[]>("suppliers", () => []);
};
