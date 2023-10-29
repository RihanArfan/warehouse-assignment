export interface Product {
  id: string;
  product_name: string;
  icon: {
    url: string;
    colour: string;
  };
  variants: ProductVariant[];
}

interface ProductVariant {
  sku: string;
  colour: string;
  size: Size;
  quantity: number;
}

type Size = "S" | "M" | "L";
