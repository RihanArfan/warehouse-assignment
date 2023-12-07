import "https://deno.land/std@0.208.0/dotenv/load.ts";

import { handler as customerHandler } from "./handler/customerHandler.ts";
import { handler as supplierHandler } from "./handler/supplierHandler.ts";
import { heartbeat } from "./server/subscriptions.ts";

console.log("server starting...");

const CUSTOMER_PORT = parseInt(Deno.env.get("CUSTOMER_PORT")!);
const SUPPLIER_PORT = parseInt(Deno.env.get("SUPPLIER_PORT")!);

const customerServer = Deno.listen({ port: CUSTOMER_PORT });
const supplierServer = Deno.listen({ port: SUPPLIER_PORT });

console.info(`[customer] socket bound to localhost:${CUSTOMER_PORT}`);
console.info(`[supplier] socket bound to localhost:${SUPPLIER_PORT}`);

async function startCustomerServer() {
  for await (const conn of customerServer) {
    customerHandler(conn);
  }
}

async function startSupplierServer() {
  for await (const conn of supplierServer) {
    supplierHandler(conn);
  }
}

async function startHeartbeat() {
  heartbeat();
}

Promise.all([startCustomerServer(), startSupplierServer(), startHeartbeat()]);

// TODO(rihan.arfan): cron ./server/subscriptions.ts
