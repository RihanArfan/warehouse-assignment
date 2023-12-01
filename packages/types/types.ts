export interface Product {
  id: string;
  name: string;
  icon: {
    name: string;
    colour: string;
  };
  variants: ProductVariant[];
}

export interface ProductVariant {
  sku: string;
  colour: string;
  size: Size;
  quantity: number;
}

export type Size = "S" | "M" | "L";

export interface Broadcast {
  date: string;
  message: string;
}

export interface Supplier {
  id: string;
  name: string;
  description: string;
  icon: string;

  products: Product[];
  broadcasts: Broadcast[];
}