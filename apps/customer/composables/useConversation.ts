import type { Conversation } from "types";

export const useConversation = (id: string) => {
  const conversations = useState<Conversation[]>("conversations", () => []);
  const conversation = computed(() => {
    return conversations.value.find(
      (c) => c.supplier.toLowerCase() === id.toLowerCase()
    );
  });
  return conversation;
};
