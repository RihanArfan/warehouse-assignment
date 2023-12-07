import { BaseHandler } from "./baseHandler.ts";
import { customers, suppliers } from "../data.ts";
import * as payloads from "../server/payloads.ts";
import { Supplier } from "../server/types.ts";

class CustomerHandler extends BaseHandler {
  constructor(connection: Deno.Conn) {
    super(connection, "customer");
  }

  async handle() {
    while (true) {
      // read line from connection
      const line = await this.readLine().catch((error) => {
        if (error === "client disconnected") return "client disconnected";
        throw error;
      });
      if (!line) continue; // empty line
      if (line === "client disconnected") return; // connection closed

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
         * AUTH
         * Already authenticated if this code is reached
         */
        case "AUTH": {
          await this.send({ code: "AUTH_SUCCESS" });
          break;
        }

        /**
         * GET_SUPPLIERS
         * Returns a list of suppliers the customer belongs to
         */
        case "GET_SUPPLIERS": {
          const suppliers = this.#getSuppliers();

          await this.send({
            code: "SUPPLIERS",
            data: suppliers,
          });
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
            await this.send({
              code: "SUBSCRIBE_PRODUCT_FAILED",
              message: "invalid payload",
              errors: problems,
            });
            continue;
          }

          this.#subscribeProduct(data.productId);

          await this.send({
            code: "SUBSCRIBE_PRODUCT_SUCCESS",
            message: "subscribed to product",
          });
          break;
        }

        /**
         * UNSUBSCRIBE_PRODUCT
         * Unsubscribes from a product
         */
        case "UNSUBSCRIBE_PRODUCT": {
          // validation
          const { data, problems } = payloads.subscribeProduct(rq.payload);
          if (problems?.length || !data) {
            await this.send({
              code: "UNSUBSCRIBE_PRODUCT_FAILED",
              message: "invalid payload",
              errors: problems,
            });
            continue;
          }

          this.#unsubscribeProduct(data.productId);
          await this.send({
            code: "UNSUBSCRIBE_PRODUCT_SUCCESS",
            message: "unsubscribed from product",
          });
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

  #getCustomer() {
    return customers.find((s) => s.id === this.id)!;
  }

  #getSuppliers() {
    return this.#getCustomer().suppliers.map((id) => {
      const supplier = suppliers.find((s) => s.id === id)!;

      // exclude users and connections
      const { users, connections, ...rest } = supplier;
      return rest;
    });
  }

  #subscribeProduct(productId: string) {
    this.#getCustomer().subscribedProducts.push(productId);
  }

  #unsubscribeProduct(productId: string) {
    this.#getCustomer().subscribedProducts =
      this.#getCustomer().subscribedProducts.filter(
        (id) => id !== productId.toUpperCase()
      );
  }
}

export async function handler(conn: Deno.Conn) {
  const customerHandler = new CustomerHandler(conn);
  await customerHandler.authenticate();
  await customerHandler.handle();
}
