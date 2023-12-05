import {
  authenticate,
  onAuthenticated,
  onDisconnected,
} from "../server/authentication.ts";
import * as payloads from "../server/payloads.ts";
import { customers, suppliers } from "../data.ts";
import { send } from "../server/socket.ts";

import type { Broadcast, Product } from "../../../packages/types/types.ts";
import type { Payload, Response } from "../server/types.ts";

/**
 * Handles socket connection
 */
export async function handler(conn: Deno.Conn) {
  console.log(`[supplier] client connected (${conn.rid})`);

  let supplierId = "";

  while (true) {
    // Read line from connection
    let line = "";
    try {
      const buf = new Uint8Array(1024);
      const n = await conn.read(buf);
      if (n === null) continue;

      line = new TextDecoder().decode(buf.subarray(0, n)).trim();
    } catch (error) {
      // handle disconnect
      // can't read from a socket that is closed
      console.log(`[supplier] client disconnected (${conn.rid})`);
      onDisconnected(supplierId, conn, "supplier");
      return;
    }

    /**
     * Parse payload
     */
    let rq: Payload<any> = { action: "" };
    try {
      console.log(line);
      rq = JSON.parse(line);
    } catch (e) {
      const response = {
        code: "INVALID_DATA",
        message: "invalid json was sent",
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

      const item = authenticate(username, password, "supplier");
      if (item) supplierId = item.id;

      onAuthenticated(supplierId, conn, "supplier");

      if (supplierId) {
        const response = { code: "AUTH_SUCCESS" };
        await send(conn, response);
        continue;
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
    if (!supplierId) {
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

        onDisconnected(supplierId, conn, "supplier");
        conn.close();
        return;
      }

      /**
       * GET_PRODUCTS
       * Returns a list of products of the supplier
       */
      case "GET_PRODUCTS": {
        const products = getProducts(supplierId);

        const response = {
          code: "PRODUCTS",
          content: products,
        };
        await send(conn, response);
        break;
      }

      /**
       * GET_BROADCASTS
       * Returns a list of broadcasts of the supplier
       */
      case "GET_BROADCASTS": {
        const broadcasts = getBroadcasts(supplierId);

        const response: Response = {
          code: "BROADCASTS",
          data: broadcasts,
        };
        await send(conn, response);
        break;
      }

      /**
       * GET_CUSTOMERS
       * Returns a list of customers of the supplier
       */
      case "GET_CUSTOMERS": {
        const customers = getCustomers(supplierId);

        const response: Response = {
          code: "CUSTOMERS",
          data: customers,
        };
        await send(conn, response);
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
       * CREATE_BROADCAST
       * Sends a broadcast to all customers
       */
      case "CREATE_BROADCAST": {
        // validation
        const { data, problems } = payloads.broadcast(rq.payload);
        if (problems?.length || !data) {
          const response: Response = {
            code: "INVALID_PAYLOAD",
            message: "invalid payload",
            errors: problems,
          };

          await send(conn, response);
          continue;
        }

        const broadcast = createBroadcast(supplierId, data.message);

        const response: Response = {
          code: "BROADCAST_CREATED",
          data: broadcast,
        };
        await send(conn, response);

        // send broadcast to all connected customers
        sendBroadcast(supplierId, broadcast);

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

export function getSupplier(supplierId: string) {
  return suppliers.find((s) => s.id === supplierId);
}

function getProducts(supplierId: string): Product[] {
  return getSupplier(supplierId)?.products ?? [];
}

function getBroadcasts(supplierId: string): Broadcast[] {
  return getSupplier(supplierId)?.broadcasts ?? [];
}

function getCustomers(supplierId: string) {
  return customers.filter((c) => c.suppliers.includes(supplierId));
}

function createBroadcast(supplierId: string, message: string) {
  const supplier = getSupplier(supplierId);
  if (!supplier) throw new Error("supplier not found");

  const broadcast: Broadcast = {
    date: new Date().toISOString(),
    message,
  };

  supplier.broadcasts.push(broadcast);
  return broadcast;
}

/**
 *
 */
function sendBroadcast(supplierId: string, broadcast: Broadcast) {
  const customerConnections = customers
    .filter((c) => c.suppliers.includes(supplierId))
    .flatMap((c) => c.connections);

  for (const conn of customerConnections) {
    const response: Response = {
      code: "BROADCAST",
      data: {
        supplierId,
        ...broadcast,
      },
    };
    send(conn, response);
  }
}
