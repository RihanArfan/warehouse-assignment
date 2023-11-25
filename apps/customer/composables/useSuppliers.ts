import type { Supplier } from "base-client/types/types";

export const useSuppliers = () => {
  return useState<Supplier[]>("suppliers", () => [
    {
      id: "clothes",
      name: "Clothes",
      description: "We offer different  of items of clothing",
      icon: "i-fluent-emoji-t-shirt",

      products: unref(useProducts()),
      broadcasts: unref(useBroadcasts()),
    },
    {
      id: "kitchen",
      name: "Kitchen Utensils",
      description: "Durable kitchen utensils for busy kitchens",
      icon: "i-fluent-emoji-bowl-with-spoon",

      products: unref(useProducts()),
      broadcasts: unref(useBroadcasts()),
    },
    {
      id: "furniture",
      name: "Furniture",
      description: "Flat pack furniture for your home",
      icon: "i-fluent-emoji-chair",

      products: unref(useProducts()),
      broadcasts: unref(useBroadcasts()),
    },
    {
      id: "electronics",
      name: "Electronics",
      description: "High quality electronic components",
      icon: "i-fluent-emoji-light-bulb",

      products: unref(useProducts()),
      broadcasts: unref(useBroadcasts()),
    },
    {
      id: "toys",
      name: "Toys",
      description: "Toys for all ages",
      icon: "i-fluent-emoji-teddy-bear",

      products: [],
      broadcasts: [],
    },
  ]);
};
