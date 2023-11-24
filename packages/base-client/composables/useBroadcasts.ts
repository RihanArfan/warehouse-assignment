import type { Broadcast } from "../types/types";

export const useBroadcasts = () => {
  return useState<Broadcast[]>("broadcasts", () => [
    {
      date: "2023-10-01",
      message:
        "We are offering a 25% discount on orders over 1000 units until next year!",
    },
    {
      date: "2023-10-02",
      message: "We will be closed on the following bank holiday.",
    },
    {
      date: "2023-10-03",
      message: "Thank you all for being satisfied customers.",
    },
  ]);
};
