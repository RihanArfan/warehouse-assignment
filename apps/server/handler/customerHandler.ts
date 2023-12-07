import { BaseHandler } from "./baseHandler.ts";
import { conversations, customers, suppliers } from "../data.ts";
import * as payloads from "../server/payloads.ts";
import { Message, SuccessResponse, Supplier } from "../server/types.ts";

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
         * GET_SUBSCRIBED_PRODUCTS
         * Returns a list of subscribed products
         */
        case "GET_SUBSCRIBED_PRODUCTS": {
          const subscribedProducts = this.#getSubscribedProducts();

          await this.send({
            code: "SUBSCRIBED_PRODUCTS",
            data: subscribedProducts,
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
         * GET_CONVERSATIONS
         * Returns a list of conversations
         */
        case "GET_CONVERSATIONS": {
          const conversations = this.#getConversations();

          await this.send({
            code: "CONVERSATIONS",
            data: conversations,
          });
          break;
        }

        /**
         * SEND_MESSAGE
         * Sends a message to a supplier
         */
        case "SEND_MESSAGE": {
          // validation
          const { data, problems } = payloads.customerMessage(rq.payload);
          if (problems?.length || !data) {
            await this.send({
              code: "SEND_MESSAGE_FAILED",
              message: "invalid payload",
              errors: problems,
            });
            continue;
          }

          this.#sendMessage(data.supplierId, data.message);

          await this.send({
            code: "SEND_MESSAGE_SUCCESS",
            message: "message sent",
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

  #getConversations() {
    return conversations.filter((c) => c.customer === this.id);
  }

  #getSubscribedProducts() {
    return this.#getCustomer().subscribedProducts;
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

  async #sendMessage(supplierId: string, message: string) {
    const data = {
      date: new Date().toISOString(),
      fromCustomer: true,
      message,
    };

    const conversation = conversations.find(
      (c) => c.customer === this.id && c.supplier === supplierId
    )!;

    // if conversation does not exist, create it
    if (!conversation) {
      const customer = this.#getCustomer();
      const supplier = suppliers.find((c) => c.id === supplierId)!;

      const conversation = {
        supplier: supplier.id,
        customer: customer.id,
        messages: [data],
      };

      conversations.push(conversation);
    }

    conversation.messages.push(data);

    // send message to connected supplier clients
    const supplier = suppliers.find((s) => s.id === supplierId)!;
    const connections = supplier.connections;

    for (const conn of connections) {
      const response = JSON.stringify({
        code: "MESSAGE",
        data: {
          date: data.date,
          customerId: this.id,
          message: data.message,
        },
      });

      const textEncoder = new TextEncoder();
      await conn.write(textEncoder.encode(response));
    }
  }
}

export async function handler(conn: Deno.Conn) {
  const customerHandler = new CustomerHandler(conn);
  await customerHandler.authenticate();
  await customerHandler.handle();
}
