import type { Product } from "types";

export const useProducts = () => {
  return useState<Product[]>("products", () => []);
};
