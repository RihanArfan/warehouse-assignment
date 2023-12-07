<script lang="ts" setup>
import type { Conversation } from "types";

definePageMeta({ fullscreen: true });

const conversations = useState<Conversation[]>("conversations", () => []);

const conversationsWithMessages = computed(() =>
  conversations.value.map((conversation) => ({
    ...conversation,
    latest_message:
      conversation.messages[conversation.messages.length - 1].message,
  }))
);

const unreadConversations = useState<string[]>(
  "unread-conversations",
  () => []
);

const recentMessages = computed(() => {
  const messages = conversationsWithMessages.value.map((conversation) => {
    const supplier = useSupplier(conversation.supplier);
    const name = supplier?.value.name;

    const isUnread = unreadConversations.value.includes(supplier.value.id);

    return {
      supplierId: conversation.supplier,
      supplierName: name,
      latestMessage: conversation.latest_message,
      isUnread,
    };
  });

  return messages;
});

const isNewConversationOpen = ref(false);
</script>

<template>
  <div class="flex h-full">
    <div class="flex flex-col border-r border-r-300 w-1/3">
      <div
        class="px-6 py-4 sm:py-5 mt-0.5 lg:px-10 flex justify-between items-center"
      >
        <h1 class="font-semibold text-2xl select-auto">Messages</h1>

        <!-- <UButton
          icon="i-fluent-compose-24-filled"
          size="md"
          :ui="{ rounded: 'rounded-full' }"
          @click="isNewConversationOpen = true"
        /> -->
      </div>

      <div class="flex flex-col px-2">
        <NuxtLink
          v-for="message in recentMessages"
          :key="message.supplierId"
          class="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-100"
          active-class="bg-gray-300/30"
          :to="`/messages/${message.supplierId}`"
        >
          <UAvatar
            size="md"
            :alt="message.supplierName"
            :ui="{
              background: 'bg-gray-300/50',
            }"
          />
          <div class="flex flex-col justify-center gap-1 min-w-0">
            <h2 class="font-semibold text-md">{{ message.supplierName }}</h2>
            <p class="text-sm truncate text-gray-500">
              {{ message.latestMessage }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div class="flex-grow p-5">
      <div
        v-if="$route.fullPath === '/messages'"
        class="flex flex-col items-center justify-center h-full"
      >
        <UIcon name="i-fluent-chat-48-regular" class="text-gray-300 text-7xl" />
        <h1 class="text-gray-300 text-2xl mt-5 font-medium">
          Select a conversation
        </h1>
      </div>

      <NuxtPage />
    </div>
  </div>
</template>
