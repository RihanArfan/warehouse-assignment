import type {
  Customer as BaseCustomer,
  Supplier as BaseSupplier,
  Response,
  SuccessResponse,
  Alert,
  Conversation,
  Message,
} from "../../../packages/types/types.ts";

type Customer = BaseCustomer & {
  connections: Deno.Conn[];
};

type Supplier = BaseSupplier & {
  connections: Deno.Conn[];
};

type Payload<T> = {
  action: string;
  payload?: T;
};

export type {
  Customer,
  Supplier,
  Payload,
  Response,
  SuccessResponse,
  Alert,
  Conversation,
  Message,
};
