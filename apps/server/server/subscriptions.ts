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
