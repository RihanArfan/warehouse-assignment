import { BaseHandler } from "./baseHandler.ts";
import { conversations, customers, suppliers } from "../data.ts";
import * as payloads from "../server/payloads.ts";
import type {
  Broadcast,
  Product,
  ProductVariant,
  Alert,
} from "../../../packages/types/types.ts";

class SupplierHandler extends BaseHandler {
  constructor(connection: Deno.Conn) {
    super(connection, "supplier");
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
         * CREATE_PRODUCT
         */
        case "CREATE_PRODUCT": {
          // validation
          const { data, problems } = payloads.product(rq?.payload);
          if (problems?.length || !data) {
            await this.send({
              code: "INVALID_PAYLOAD",
              message: "invalid payload",
              errors: problems,
            });
            continue;
          }

          const product = this.#createProduct(data.id, data.name, data.icon);
          await this.send({
            code: "PRODUCT_CREATED",
            data: product,
          });
          break;
        }

        /**
         * CREATE_VARIANT
         */
        case "CREATE_VARIANT": {
          // validation
          const { data, problems } = payloads.variant(rq?.payload);
          if (problems?.length || !data) {
            await this.send({
              code: "INVALID_PAYLOAD",
              message: "invalid payload",
              errors: problems,
            });
            continue;
          }

          const variant = this.#createVariant(
            data.productId,
            data.colour,
            data.size,
            data.quantity
          );

          await this.send({
            code: "VARIANT_CREATED",
            data: variant,
          });
          break;
        }

        /**
         * EDIT_PRODUCT
         */
        case "EDIT_PRODUCT": {
          // validation
          const { data, problems } = payloads.product(rq?.payload);
          if (problems?.length || !data) {
            await this.send({
              code: "INVALID_PAYLOAD",
              message: "invalid payload",
              errors: problems,
            });
            continue;
          }

          const product = this.#editProduct(data.id, data.name, data.icon);
          await this.send({
            code: "PRODUCT_EDITED",
            data: product,
          });
          break;
        }

        /**
         * EDIT_VARIANT
         */
        case "EDIT_VARIANT": {
          // validation
          const { data, problems } = payloads.editVariant(rq?.payload);
          if (problems?.length || !data) {
            await this.send({
              code: "INVALID_PAYLOAD",
              message: "invalid payload",
              errors: problems,
            });
            continue;
          }

          const variant = this.#editVariant(data.sku, data.quantity);

          await this.send({
            code: "VARIANT_EDITED",
            data: variant,
          });
          break;
        }

        /**
         * DELETE_PRODUCT
         */
        case "DELETE_PRODUCT": {
          // validation
          const { data, problems } = payloads.deleteProduct(rq?.payload);
          if (problems?.length || !data) {
            await this.send({
              code: "INVALID_PAYLOAD",
              message: "invalid payload",
              errors: problems,
            });
            continue;
          }

          const deleted = this.#deleteProduct(data.id);
          await this.send({
            code: "PRODUCT_DELETED",
            data: deleted,
          });
          break;
        }

        /**
         * DELETE_VARIANT
         */
        case "DELETE_VARIANT": {
          // validation
          const { data, problems } = payloads.deleteVariant(rq?.payload);
          if (problems?.length || !data) {
            await this.send({
              code: "INVALID_PAYLOAD",
              message: "invalid payload",
              errors: problems,
            });
            continue;
          }

          const deleted = this.#deleteVariant(data.sku);
          await this.send({
            code: "VARIANT_DELETED",
            data: deleted,
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
          const { data, problems } = payloads.supplierMessage(rq.payload);
          if (problems?.length || !data) {
            await this.send({
              code: "SEND_MESSAGE_FAILED",
              message: "invalid payload",
              errors: problems,
            });
            continue;
          }

          this.#sendMessage(data.customerId, data.message);

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

  #getSupplier() {
    return suppliers.find((s) => s.id === this.id)!;
  }

  #getProducts() {
    return this.#getSupplier().products ?? [];
  }

  #getProduct(productId: string) {
    return this.#getProducts().find((p) => p.id === productId);
  }

  #getVariant(sku: string) {
    return this.#getProducts()
      .flatMap((p) => p.variants)
      .find((v) => v.sku === sku.toUpperCase());
  }

  #getBroadcasts() {
    return this.#getSupplier().broadcasts ?? [];
  }

  #getCustomers() {
    return customers.filter((c) => c.suppliers.includes(this.id));
  }

  #getConversations() {
    return conversations.filter((c) => c.supplier === this.id);
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
  async #sendBroadcast(broadcast: Broadcast) {
    const connections = this.#getCustomers().flatMap((c) => c.connections);

    for (const conn of connections) {
      const data: Alert = {
        date: broadcast.date,
        type: "Broadcast",
        icon: "i-fluent-megaphone-16-filled",
        message: `${this.#getSupplier().name}: ${broadcast.message}`,
        rawMessage: broadcast.message,
        supplierId: this.id,
      };

      const response = JSON.stringify({
        code: "BROADCAST",
        data,
      });

      const textEncoder = new TextEncoder();
      await conn.write(textEncoder.encode(response));
    }
  }

  #createProduct(id: string, name: string, icon: string) {
    const product: Product = {
      id: id.toUpperCase(),
      name,
      icon,
      variants: [],
    };

    this.#getSupplier().products.push(product);

    return product;
  }

  #createVariant(
    productId: string,
    colour: string,
    size: string,
    quantity: number
  ) {
    const variant: ProductVariant = {
      sku: `${productId.toUpperCase()}-${colour.toUpperCase()}-${size.toUpperCase()}`,
      quantity,
      colour,
      // @ts-expect-error
      size,
    };

    const product = this.#getProduct(productId);
    if (!product) throw new Error("product not found");

    product.variants.push(variant);

    return variant;
  }

  /**
   * Edit a product
   */
  #editProduct(id: string, name: string, icon: string) {
    const product = this.#getProduct(id);
    if (!product) throw new Error("product not found");

    product.name = name;
    product.icon = icon;

    return product;
  }

  /**
   * Edit a variant
   */
  #editVariant(sku: string, quantity: number) {
    const variant = this.#getVariant(sku);
    if (!variant) throw new Error("variant not found");

    variant.quantity = quantity;

    return variant;
  }

  /**
   * Delete a product
   */
  #deleteProduct(id: string) {
    const products = this.#getProducts();
    const productIndex = products.findIndex((p) => p.id === id.toUpperCase());
    if (productIndex === -1) throw new Error("product not found");

    products.splice(productIndex, 1);

    return true;
  }

  /**
   * Delete a variant
   */
  #deleteVariant(sku: string) {
    const products = this.#getProducts();
    const variants = products.flatMap((p) => p.variants);
    const variantIndex = variants.findIndex((v) => v.sku === sku.toUpperCase());
    if (variantIndex === -1) throw new Error("variant not found");

    variants.splice(variantIndex, 1);

    return true;
  }

  async #sendMessage(customerId: string, message: string) {
    const data = {
      date: new Date().toISOString(),
      fromCustomer: false,
      message,
    };

    const conversation = conversations.find(
      (c) =>
        c.supplier === this.id &&
        c.customer.toLowerCase() === customerId.toLowerCase()
    )!;

    // if conversation does not exist, create it
    if (!conversation) {
      const customer = customers.find((c) => c.id === customerId)!;
      const supplier = this.#getSupplier();

      const conversation = {
        supplier: supplier.id,
        customer: customer.id,
        messages: [data],
      };

      conversations.push(conversation);
    }

    conversation.messages.push(data);

    // send message to connected customer clients
    const customer = customers.find((s) => s.id === customerId)!;
    const connections = customer.connections;

    for (const conn of connections) {
      const response = JSON.stringify({
        code: "MESSAGE",
        data: {
          date: data.date,
          supplierId: this.id,
          message: data.message,
        },
      });

      const textEncoder = new TextEncoder();
      await conn.write(textEncoder.encode(response));
    }
  }
}

export async function handler(conn: Deno.Conn) {
  const supplierHandler = new SupplierHandler(conn);
  await supplierHandler.authenticate();
  await supplierHandler.handle();
}
