export interface Product {
  id: string;
  name: string;
  icon: string;
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

  users: User[];
  products: Product[];
  broadcasts: Broadcast[];
}

export interface Customer {
  id: string;
  name: string;
  users: User[];

  suppliers: Supplier["id"][];
  subscribedProducts: Product["id"][];
}

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface Alert {
  date: string;
  icon: string;
  type: string;
  message: string;
  supplierId?: string;
  rawMessage?: string;
}

export interface Message {
  date: string;
  fromCustomer: boolean;
  message: string;
}
export interface Conversation {
  supplier: string;
  customer: string;
  messages: Message[];
}

type BaseResponse = { code: string };
export type ErrorResponse = BaseResponse & { message: string; errors?: any };
export type SuccessResponse<T> = BaseResponse & { data?: T };
export type Response<T = any> = ErrorResponse | SuccessResponse<T>;
