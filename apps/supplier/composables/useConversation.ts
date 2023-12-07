import type { Conversation } from "types";

export const useConversation = (id: string) => {
  const conversations = useState<Conversation[]>("conversations", () => []);
  const conversation = computed(() => {
    return conversations.value.find((c) => c.customer === id);
  });
  return conversation;
};
