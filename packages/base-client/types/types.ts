export interface Product {
  id: string;
  product_name: string;
  icon: {
    url: string;
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

type Size = "S" | "M" | "L";

export interface Broadcast {
  date: string;
  message: string;
}
