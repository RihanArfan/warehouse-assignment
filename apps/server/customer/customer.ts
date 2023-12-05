import {
  authenticate,
  onAuthenticated,
  onDisconnected,
} from "../server/authentication.ts";
import * as payloads from "../server/payloads.ts";
import { customers, suppliers } from "../data.ts";
import { send } from "../server/socket.ts";

import type { Broadcast, Product } from "../../../packages/types/types.ts";
import type { Payload, Response, Supplier } from "../server/types.ts";
import { getSupplier } from "../supplier/supplier.ts";

/**
 * Handles socket connection
 */
export async function handler(conn: Deno.Conn) {
  let customerId = "";
  console.log("stuff2");

  while (true) {
    // Read line from connection
    const buf = new Uint8Array(1024);
    const n = await conn.read(buf);
    if (n === null) continue;
    const line = new TextDecoder().decode(buf.subarray(0, n)).trim();

    let rq: Payload<any> = { action: "" };

    /**
     * Parse payload
     */
    try {
      rq = JSON.parse(line);
    } catch (e) {
      const response = {
        code: "UNRECOGNISED_COMMAND",
        message: "invalid payload",
      };
      await send(conn, response);
      continue;
    }

    /**
     * Authentication
     */
    if (rq.action === "AUTH") {
      // validation
      const { data, problems } = payloads.auth(rq.payload);
      if (problems?.length || !data) {
        const response: Response = {
          code: "AUTH_FAILED",
          message: "invalid payload",
          errors: problems,
        };
        await send(conn, response);
        continue;
      }

      const { username, password } = data;

      const item = authenticate(username, password, "customer");
      if (item) customerId = item.id;

      onAuthenticated(customerId, conn, "customer");

      if (!customerId) {
        const response = { code: "AUTH_SUCCESS" };
        await send(conn, response);
      } else {
        const response: Response = {
          code: "AUTH_FAILED",
          message: "invalid credentials",
        };
        await send(conn, response);
        continue;
      }
    }

    // Prevent unauthenticated users from accessing other commands
    if (!customerId) {
      const response: Response = {
        code: "UNAUTHENTICATED",
        message: "authenticate first",
      };
      await send(conn, response);
      continue;
    }

    switch (rq.action) {
      /**
       * BYE_BYE
       * Disconnects the socket
       */
      case "BYE_BYE": {
        const response: Response = {
          code: "BYE_BYE",
          message: "👋",
        };
        await send(conn, response);

        onDisconnected(customerId, conn, "customer");
        conn.close();
        break;
      }

      /**
       * GET_MESSAGES
       * Returns a list of messages of the supplier
       */
      case "GET_MESSAGES": {
        // TODO: implement
        break;
      }

      /**
       * SUBSCRIBE_PRODUCT
       * Subscribes to a product
       */
      case "SUBSCRIBE_PRODUCT": {
        // validation
        const { data, problems } = payloads.subscribeProduct(rq.payload);
        if (problems?.length || !data) {
          const response: Response = {
            code: "SUBSCRIBE_PRODUCT_FAILED",
            message: "invalid payload",
            errors: problems,
          };
          await send(conn, response);
          continue;
        }

        const { productId } = data;

        subscribeProduct(customerId, productId);

        const response: Response = {
          code: "SUBSCRIBE_PRODUCT_SUCCESS",
          message: "subscribed to product",
        };

        await send(conn, response);
        break;
      }

      /**
       * Unknown command
       * Returns an error response
       */
      default: {
        const response: Response = {
          code: "UNKNOWN_COMMAND",
          message: "unknown command",
        };
        await send(conn, response);
        break;
      }
    }
  }
}

export function getCustomer(customerId: string) {
  return customers.find((s) => s.id === customerId);
}

export function getSuppliers(
  customerId: string
): Omit<Supplier, "connections">[] {
  const supplierIds = getCustomer(customerId)?.suppliers ?? [];
  const suppliersWithConnections = suppliers.filter((s) =>
    supplierIds.includes(s.id)
  );

  // exclude connections from response
  return suppliersWithConnections.map((s) => {
    const { connections, ...rest } = s;
    return rest;
  });
}

function subscribeProduct(customerId: string, productId: string) {
  const customer = getCustomer(customerId);
  if (!customer) throw new Error("customer not found");

  customer.subscribedProducts.push(productId);
}
