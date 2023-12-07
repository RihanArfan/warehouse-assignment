<script setup lang="ts">
import type { FormError } from "#ui/types";

const route = useRoute("messages-message");

const conversation = useConversation(route.params.message);
const supplier = useSupplier(conversation.value!.supplier);

const state = reactive({ message: "" });

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.message.trim())
    errors.push({ path: "message", message: "Required" });
  return errors;
};

async function onSubmit() {
  useInvoke("send_message", {
    supplierId: route.params.message,
    message: state.message?.trim(),
  });

  conversation.value!.messages.push({
    date: new Date().toISOString(),
    message: state.message,
    fromCustomer: true,
  });

  state.message = "";
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-col gap-2 grow overflow-y-auto">
      <div v-for="message in conversation!.messages" :key="message.date">
        <div class="flex gap-3">
          <UAvatar
            v-if="!message.fromCustomer"
            :alt="supplier.name"
            size="md"
            :ui="{ background: 'bg-gray-200/75' }"
          />
          <div
            v-else
            class="rounded-full h-10 w-10 flex items-center justify-center bg-blue-100 text-2xl text-blue-800"
          >
            <UIcon name="i-fluent-person-16-filled" />
          </div>
          <div
            class="rounded p-3"
            :class="{
              'bg-gray-300/40': !message.fromCustomer,
              'bg-blue-100': message.fromCustomer,
            }"
          >
            <p class="text-sm text-gray-600 font-medium">
              {{ message.message }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <UForm
      :validate="validate"
      :state="state"
      class="h-10 flex gap-4 items-center"
      @submit="onSubmit"
    >
      <UInput
        v-model="state.message"
        variant="outline"
        placeholder="Send a message..."
        size="xl"
        class="grow"
        autocomplete="off"
      />
      <UButton
        type="submit"
        icon="i-fluent-send-16-filled"
        size="lg"
        :ui="{ rounded: 'rounded-full' }"
      />
    </UForm>
  </div>
</template>
