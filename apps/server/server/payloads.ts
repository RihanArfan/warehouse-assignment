import { type } from "npm:arktype";

// universal
export const auth = type({
  email: "string",
  password: "string",
});

// suppliers
export const broadcast = type({
  message: "string",
});

export const product = type({
  id: "string",
  name: "string",
  icon: "string",
});

export const deleteProduct = type({
  id: "string",
});

export const variant = type({
  productId: "string",
  quantity: "number",
  colour: "string",
  size: "string",
});

export const editVariant = type({
  sku: "string",
  quantity: "number",
});

export const deleteVariant = type({
  sku: "string",
});

// customers
export const subscribeProduct = type({
  productId: "string",
});
