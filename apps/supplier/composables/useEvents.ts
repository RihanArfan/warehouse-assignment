import type { Conversation, SuccessResponse } from "types";

export const useEvents = async () => {
  const toast = useToast();

  const products = useProducts();
  const broadcasts = useBroadcasts();
  const conversations = useState<Conversation[]>("conversations", () => []);
  const customers = useCustomers();

  const isDebug = useState<boolean>("is-debug", () => true);
  const unreadConversation = useState<string[]>(
    "unread-conversations",
    () => []
  );

  await useListen<string>("server", ({ payload }) => {
    const response = JSON.parse(payload) as SuccessResponse<any>;

    if (isDebug.value)
      toast.add({
        title: "Debug",
        description: `Received push - ${response.code}`,
      });

    switch (response.code) {
      case "AUTH_SUCCESS":
        useInvoke("get_products");
        useInvoke("get_broadcasts");
        useInvoke("get_customers");
        useInvoke("get_conversations");
        break;

      case "PRODUCTS":
        if (!response.data) break;
        products.value = response.data;
        break;

      case "BROADCASTS":
        if (!response.data) break;
        broadcasts.value = response.data;
        break;

      case "CUSTOMERS":
        customers.value = response.data;
        break;

      case "CONVERSATIONS":
        conversations.value = response.data;
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

      case "MESSAGE": {
        const conversation = useConversation(response.data.customerId);

        if (!conversation.value) return useInvoke("get_conversations");

        conversation.value.messages.push({
          date: response.data.date,
          message: response.data.message,
          fromCustomer: true,
        });

        unreadConversation.value.push(response.data.supplierId);
      }
    }
  });
};
