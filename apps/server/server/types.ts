import type {
  Customer as BaseCustomer,
  Supplier as BaseSupplier,
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

type BaseResponse = { code: string };
type ErrorResponse = BaseResponse & { message: string; errors?: any };
type SuccessResponse<T> = BaseResponse & { data?: T };
type Response<T = any> = ErrorResponse | SuccessResponse<T>;

export type { Customer, Supplier, Payload, Response };
