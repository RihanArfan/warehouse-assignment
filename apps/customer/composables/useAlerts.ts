import type { Alert } from "types";

export const useAlerts = () => {
  return useState<Alert[]>("alerts", () => []);
};
