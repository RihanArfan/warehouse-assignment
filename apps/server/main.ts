import "https://deno.land/std@0.208.0/dotenv/load.ts";

import { handler as customerHandler } from "./handler/customerHandler.ts";
import { handler as supplierHandler } from "./handler/supplierHandler.ts";
import {
  heartbeat,
  scheduledAlerts,
  scheduledProductUpdates,
} from "./server/subscriptions.ts";

console.log("server starting...");

const CUSTOMER_PORT = parseInt(Deno.env.get("CUSTOMER_PORT")!);
const SUPPLIER_PORT = parseInt(Deno.env.get("SUPPLIER_PORT")!);

const customerServer = Deno.listen({ port: CUSTOMER_PORT });
const supplierServer = Deno.listen({ port: SUPPLIER_PORT });

console.info(`[customer] socket bound to localhost:${CUSTOMER_PORT}`);
console.info(`[supplier] socket bound to localhost:${SUPPLIER_PORT}`);

export async function startCustomerServer() {
  for await (const conn of customerServer) {
    customerHandler(conn);
  }
}

export async function startSupplierServer() {
  for await (const conn of supplierServer) {
    supplierHandler(conn);
  }
}

Promise.all([
  startCustomerServer(),
  startSupplierServer(),
  heartbeat(),
  scheduledAlerts(),
  scheduledProductUpdates(),
]);
