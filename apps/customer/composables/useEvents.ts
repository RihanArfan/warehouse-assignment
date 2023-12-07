import type { SuccessResponse } from "types";

export const useEvents = async () => {
  const toast = useToast();

  const suppliers = useSuppliers();

  await useListen<string>("server", ({ payload }) => {
    const response = JSON.parse(payload) as SuccessResponse<any>;

    switch (response.code) {
      case "AUTH_SUCCESS":
        useInvoke("get_suppliers");
        break;

      case "SUPPLIERS":
        suppliers.value = response.data;
        break;

      case "SUBSCRIBE_PRODUCT_SUCCESS":
        toast.add({
          title: "Subscribed",
          description: "You have subscribed to the product",
          color: "green",
        });
        break;

      case "UNSUBSCRIBE_PRODUCT_SUCCESS":
        toast.add({
          title: "Unsubscribed",
          description: "You have unsubscribed from the product",
          color: "green",
        });
        break;
    }
  });
};
