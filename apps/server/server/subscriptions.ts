import { Alert, SuccessResponse } from "./types.ts";
import { unauthenticatedSockets, customers, suppliers } from "../data.ts";

/**
 * Sends a heartbeat to all connections every second
 */
export function heartbeat() {
  const INTERVAL_MS = 1000;

  setInterval(() => {
    for (const socket of unauthenticatedSockets) {
      socket.write(new TextEncoder().encode("HEARTBEAT\n"));
    }

    for (const customer of customers) {
      for (const socket of customer.connections) {
        socket.write(new TextEncoder().encode("HEARTBEAT\n"));
      }
    }

    for (const supplier of suppliers) {
      for (const socket of supplier.connections) {
        socket.write(new TextEncoder().encode("HEARTBEAT\n"));
      }
    }
  }, INTERVAL_MS);
}

export function scheduledProductUpdates() {
  const INTERVAL_SEC = parseInt(Deno.env.get("PUSH_PRODUCT_INTERVAL_SEC")!);

  setInterval(() => {
    const activeCustomers = customers.filter((c) => c.connections.length > 0);

    for (const customer of activeCustomers) {
      const customerSuppliers = suppliers
        .filter((s) => customer.suppliers.includes(s.id))
        .map((s) => {
          const { users, connections, ...rest } = s;
          return rest;
        });

      const response = {
        code: "SUPPLIERS",
        data: customerSuppliers,
      };

      for (const socket of customer.connections) {
        socket.write(new TextEncoder().encode(JSON.stringify(response) + "\n"));
      }
    }
  }, INTERVAL_SEC * 1000);
}

export function scheduledAlerts() {
  const INTERVAL_SEC = parseInt(Deno.env.get("PUSH_ALERT_INTERVAL_SEC")!);

  setInterval(async () => {
    const activeCustomers = customers.filter((c) => c.connections.length > 0);

    for (const customer of activeCustomers) {
      const subscribedProducts = customer.subscribedProducts.map((productId) =>
        suppliers.flatMap((s) => s.products).find((p) => p.id === productId)
      );

      const alerts: SuccessResponse<Alert>[] = [];
      let increment = 0;

      for (const product of subscribedProducts) {
        if (!product) continue;

        const { id, name, variants } = product;

        for (const variant of variants) {
          if (variant.quantity <= 0) {
            alerts.push({
              code: "ALERT",
              data: {
                // add 1 millisecond to each alert so that they are not all sent at the same time
                date: new Date(Date.now() + increment++).toISOString(),
                icon: "i-fluent-warning-16-filled",
                type: "Stock update",
                message: `Product ${name} (${variant.sku}) is out of stock`,
                supplierId: id,
              },
            });
          }

          if (variant.quantity <= 5) {
            alerts.push({
              code: "ALERT",
              data: {
                date: new Date(Date.now() + increment++).toISOString(),
                icon: "i-fluent-arrow-trending-down-16-filled",
                type: "Stock update",
                message: `Product ${name} (${variant.sku}) is low in stock`,
                supplierId: id,
              },
            });
          }

          if (variant.quantity >= 5) {
            alerts.push({
              code: "ALERT",
              data: {
                date: new Date(Date.now() + increment++).toISOString(),
                icon: "i-fluent-arrow-trending-16-filled",
                type: "Stock update",
                message: `Product ${name} (${variant.sku}) in stock`,
                supplierId: id,
              },
            });
          }
        }
      }

      for (const socket of customer.connections) {
        for (const alert of alerts) {
          await socket.write(
            new TextEncoder().encode(JSON.stringify(alert) + "\n")
          );
        }
      }
    }
  }, INTERVAL_SEC * 1000);
}
