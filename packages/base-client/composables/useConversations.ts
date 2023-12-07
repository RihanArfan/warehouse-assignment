import type { Conversation } from "types";

export const useProducts = () => {
  return useState<Conversation[]>("conversations", () => []);
};
