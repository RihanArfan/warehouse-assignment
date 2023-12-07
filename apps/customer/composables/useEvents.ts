import type { Conversation, SuccessResponse } from "types";

export const useEvents = async () => {
  const toast = useToast();

  const suppliers = useSuppliers();
  const subscribedProducts = useSubscribedProducts();
  const alerts = useAlerts();
  const conversations = useState<Conversation[]>("conversations", () => []);

  const isUnreadAlert = useState<boolean>("is-alert-unread", () => false);
  const isDebug = useState<boolean>("is-debug", () => true);
  const unreadConversations = useState<string[]>(
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
        useInvoke("get_suppliers");
        useInvoke("get_subscribed_products");
        useInvoke("get_conversations");
        break;

      case "SUPPLIERS":
        suppliers.value = response.data;
        break;

      case "CONVERSATIONS":
        conversations.value = response.data;
        break;

      case "SUBSCRIBED_PRODUCT":
        subscribedProducts.value = response.data;
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

      case "BROADCAST": {
        isUnreadAlert.value = true;
        alerts.value.push(response.data);

        const selectedSupplier = useSupplier(response.data.supplierId);
        if (selectedSupplier.value) {
          selectedSupplier.value.broadcasts.push({
            date: response.data.date,
            message: response.data.rawMessage,
          });
        }

        break;
      }

      case "ALERT": {
        isUnreadAlert.value = true;
        alerts.value.push(response.data);

        break;
      }

      case "MESSAGE": {
        const conversation = useConversation(response.data.supplierId);

        if (!conversation.value) return useInvoke("get_conversations");

        conversation.value.messages.push({
          date: response.data.date,
          message: response.data.message,
          fromCustomer: false,
        });

        unreadConversations.value.push(response.data.supplierId);
      }
    }
  });
};
