<script lang="ts" setup>
definePageMeta({ fullscreen: true });

const recent_messages = ref([
  {
    email: "example@example.com",
    name: "John Egbert",
    latest_message: "Hello, I would like to order 1000 units of this product.",
  },
  {
    email: "jade@example.com",
    name: "Jade Harley",
    latest_message: "Do you offer custom colours?",
  },
  {
    email: "dave@example.com",
    name: "Dave Strider",
    latest_message: "What's the status of the delivery?",
  },
]);

const isNewConversationOpen = ref(false);
</script>

<template>
  <div class="flex h-full">
    <div class="flex flex-col border-r border-r-300 w-1/3">
      <div
        class="px-5 py-4 sm:py-5 mt-0.5 lg:px-10 flex justify-between items-center"
      >
        <h1 class="font-semibold text-2xl select-auto">Messages</h1>

        <UButton
          icon="i-fluent-compose-24-filled"
          size="md"
          :ui="{ rounded: 'rounded-full' }"
          @click="isNewConversationOpen = true"
        />
      </div>

      <div class="flex flex-col px-2">
        <NuxtLink
          v-for="message in recent_messages"
          :key="message.email"
          class="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-100"
          active-class="bg-gray-300/25"
          :to="`/messages/${message.email}`"
        >
          <UAvatar
            size="md"
            :alt="message.name"
            :ui="{
              background: 'bg-gray-200',
            }"
          />
          <div class="flex flex-col justify-center gap-1 min-w-0">
            <h2 class="font-semibold text-md">{{ message.name }}</h2>
            <p class="text-sm truncate text-gray-500">
              {{ message.latest_message }}
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

    <NewMessageModal v-model="isNewConversationOpen" />
  </div>
</template>
