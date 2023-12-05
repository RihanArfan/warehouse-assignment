import { BaseHandler } from "./baseHandler.ts";
import { customers, suppliers } from "../data.ts";
import * as payloads from "../server/payloads.ts";
import type { Broadcast } from "../../../packages/types/types.ts";

class SupplierHandler extends BaseHandler {
  constructor(connection: Deno.Conn) {
    super(connection, "supplier");
  }

  async handle() {
    while (true) {
      // read line from connection
      const line = await this.readLine().catch((error) => {
        if (error.message === "client disconnected") return "close";
      });
      if (!line) continue; // empty line
      if (line === "close") return; // connection closed

      // parse payload
      const rq = await this.parsePayload(line).catch((error) => undefined);
      if (!rq) continue;

      switch (rq.action) {
        /**
         * BYE_BYE
         * Disconnects the socket
         */
        case "BYE_BYE": {
          await this.send({ code: "BYE_BYE", message: "👋" });
          return this.disconnect();
        }

        /**
         * GET_PRODUCTS
         * Returns a list of products of the supplier
         */
        case "GET_PRODUCTS": {
          const products = this.#getProducts();

          await this.send({
            code: "PRODUCTS",
            data: products,
          });
          break;
        }

        /**
         * GET_BROADCASTS
         * Returns a list of broadcasts of the supplier
         */
        case "GET_BROADCASTS": {
          const broadcasts = this.#getBroadcasts();
          await this.send({ code: "BROADCASTS", data: broadcasts });
          break;
        }

        /**
         * GET_CUSTOMERS
         * Returns a list of customers of the supplier
         */
        case "GET_CUSTOMERS": {
          const customers = this.#getCustomers();
          await this.send({ code: "CUSTOMERS", data: customers });
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
          const { data, problems } = payloads.broadcast(rq?.payload);
          if (problems?.length || !data) {
            await this.send({
              code: "INVALID_PAYLOAD",
              message: "invalid payload",
              errors: problems,
            });
            continue;
          }

          const broadcast = this.#createBroadcast(data.message);
          await this.send({
            code: "BROADCAST_CREATED",
            data: broadcast,
          });
          break;
        }

        /**
         * Unknown command
         * Returns an error response
         */
        default: {
          await this.send({
            code: "UNKNOWN_COMMAND",
            message: "unknown command",
          });
          break;
        }
      }
    }
  }

  #getSupplier() {
    return suppliers.find((s) => s.id === this.id)!;
  }

  #getProducts() {
    return this.#getSupplier().products ?? [];
  }

  #getBroadcasts() {
    return this.#getSupplier().broadcasts ?? [];
  }

  #getCustomers() {
    return customers.filter((c) => c.suppliers.includes(this.id));
  }

  /**
   * Creates a broadcast
   */
  #createBroadcast(message: string) {
    const broadcast: Broadcast = {
      date: new Date().toISOString(),
      message,
    };

    this.#getSupplier().broadcasts.push(broadcast);

    // send broadcast to all connected customers
    this.#sendBroadcast(broadcast);

    return broadcast;
  }

  /**
   * Send broadcat to all connected customers
   */
  #sendBroadcast(broadcast: Broadcast) {
    const connections = this.#getCustomers().flatMap((c) => c.connections);

    for (const conn of connections) {
      this.send({
        code: "BROADCAST",
        data: {
          id: this.id,
          ...broadcast,
        },
      });
    }
  }
}

export async function handler(conn: Deno.Conn) {
  const supplierHandler = new SupplierHandler(conn);
  await supplierHandler.authenticate();
  await supplierHandler.handle();
}
