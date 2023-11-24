import type { Supplier } from "base-client/types/types";

export const useSuppliers = () => {
  return useState<Supplier[]>("suppliers", () => [
    {
      id: "clothes",
      name: "Clothes Supplier",
      description: "We offer different  of items of clothing",
      icon: "i-fluent-emoji-t-shirt",

      products: unref(useProducts()),
      broadcasts: unref(useBroadcasts()),
    },
  ]);
};
