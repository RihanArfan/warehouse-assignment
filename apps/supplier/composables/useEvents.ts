import type { SuccessResponse } from "types";

export const useEvents = async () => {
  const toast = useToast();

  const products = useProducts();
  const broadcasts = useBroadcasts();

  await useListen<string>("server", ({ payload }) => {
    const response = JSON.parse(payload) as SuccessResponse<any>;

    switch (response.code) {
      case "AUTH_SUCCESS":
        useInvoke("get_products");
        useInvoke("get_broadcasts");
        break;

      case "PRODUCTS":
        if (!response.data) break;
        products.value = response.data;
        break;

      case "BROADCASTS":
        if (!response.data) break;
        broadcasts.value = response.data;
        break;

      case "PRODUCT_DELETED":
        toast.add({
          title: "Product deleted",
          description: "Product has been deleted",
          color: "green",
        });
        break;

      case "VARIANT_DELETED":
        toast.add({
          title: "Variant deleted",
          description: "Variant has been deleted",
          color: "green",
        });
        break;

      case "BROADCAST_CREATED":
        toast.add({
          title: "Broadcast sent",
          description: "Broadcast has been sent to all customers",
          color: "green",
        });
        break;
    }
  });
};
