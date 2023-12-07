export const useSubscribedProducts = () => {
  return useState<string[]>("subscribed-products", () => []);
};
