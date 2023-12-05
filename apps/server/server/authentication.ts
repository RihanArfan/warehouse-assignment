import { customers, suppliers } from "../data.ts";
import type { Customer, Supplier } from "./types.ts";
import { verify } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";

// https://stackoverflow.com/questions/54165536/typescript-function-return-type-based-on-input-parameter
type TypeName = "supplier" | "customer";

type ObjectType<T> = T extends "customer"
  ? Customer
  : T extends "supplier"
  ? Supplier
  : never;

/**
 * Authenticates user and returns the user's supplier/customer object if successful
 *
 * @returns false if authentication fails
 * @returns Supplier | Customer if authentication successful
 */
export function authenticate<T extends TypeName>(
  email: string,
  password: string,
  type: T
): false | ObjectType<T> {
  const items = type === "supplier" ? suppliers : customers;

  // find user's supplier/company
  const item = items.find((item) => {
    return item.users.find((u) => u.email === email);
  });

  if (!item) return false;

  // find user
  const user = item.users.find((u) => u.email === email)!; // guaranteed to exist because of the check above

  const isVerified = verify(password, user.password);
  if (!isVerified) return false;

  return item as ObjectType<T>;
}

/**
 * Adds users connection to the supplier/customer object
 */
export function onAuthenticated(id: string, conn: Deno.Conn, type: TypeName) {
  const items = type === "supplier" ? suppliers : customers;

  const item = items.find((item) => item.id === id);
  if (!item) return;

  // add connection to supplier/customer object
  item.connections.push(conn);
}

/**
 * Removes users connection from the supplier/customer object
 */
export function onDisconnected(id: string, conn: Deno.Conn, type: TypeName) {
  const items = type === "supplier" ? suppliers : customers;

  const item = items.find((item) => item.id === id);
  if (!item) return;

  // remove connection from supplier/customer object
  item.connections = item.connections.filter((c) => c !== conn);
}
