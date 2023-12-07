<script setup lang="ts">
import type { FormError } from "#ui/types";
import type { Conversation } from "types";

const isOpen = defineModel<boolean>();
const customers = useCustomers();
const conversations = useState<Conversation[]>("conversations", () => []);

const state = reactive({
  message: "",
  selected: [],
});

const HALF_SECOND = 500;
watchEffect(() => {
  if (!isOpen.value) {
    setTimeout(() => {
      state.message = "";
      state.selected = [];
    }, HALF_SECOND);
  }
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.message.trim())
    errors.push({ path: "message", message: "Required" });
  return errors;
};

async function onSubmit() {
  for (const customerId of state.selected) {
    useInvoke("send_message", {
      customerId,
      message: state.message?.trim(),
    });

    const conversation = conversations.value.find(
      (conversation) => conversation.customer === customerId
    );

    conversation!.messages.push({
      date: new Date().toISOString(),
      message: state.message,
      fromCustomer: false,
    });
  }

  isOpen.value = false;
}
</script>

<template>
  <UModal v-model="isOpen">
    <UForm :validate="validate" :state="state" @submit="onSubmit">
      <UModalCard>
        <template #header>
          <h1 class="font-semibold text-lg select-auto">New message</h1>
        </template>

        <div class="flex flex-col gap-4">
          <UFormGroup label="Customers" name="selected">
            <USelectMenu
              v-model="state.selected"
              :options="customers"
              multiple
              searchable
              size="md"
              placeholder="Select customers"
              value-attribute="id"
              option-attribute="name"
            />
          </UFormGroup>

          <UFormGroup label="Message" name="message">
            <UInput v-model="state.message" placeholder="Message" size="md" />
          </UFormGroup>
        </div>

        {{ state }}

        <template #footer>
          <UButton
            type="submit"
            color="primary"
            variant="solid"
            label="Send message"
          />
        </template>
      </UModalCard>
    </UForm>
  </UModal>
</template>
