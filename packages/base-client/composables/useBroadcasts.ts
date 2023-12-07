import type { Broadcast } from "types";

export const useBroadcasts = () => {
  return useState<Broadcast[]>("broadcasts", () => []);
};
