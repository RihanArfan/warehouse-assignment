import { type } from "npm:arktype";

// universal
export const auth = type({
  email: "string",
  password: "string",
});

// suppliers
export const broadcast = type({
  date: "string",
  message: "string",
});

// customers
export const subscribeProduct = type({
  productId: "string",
});
