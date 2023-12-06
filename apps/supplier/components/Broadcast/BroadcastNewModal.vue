<script setup lang="ts">
import type { FormError } from "#ui/types";

const isOpen = defineModel<boolean>();
const broadcasts = useBroadcasts();

const state = reactive({
  message: "",
});

const HALF_SECOND = 500;
watchEffect(() => {
  if (!isOpen.value) {
    setTimeout(() => {
      state.message = "";
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
  useInvoke("create_broadcast", { message: state.message?.trim() });
  broadcasts.value.push({
    date: new Date().toISOString(),
    message: state.message,
  });

  isOpen.value = false;
}
</script>

<template>
  <UModal v-model="isOpen">
    <UForm :validate="validate" :state="state" @submit="onSubmit">
      <UModalCard>
        <template #header>
          <h1 class="font-semibold text-lg select-auto">New broadcast</h1>
          <p class="my-1">Send a broadcast to all customers</p>
        </template>

        <div class="flex flex-col gap-4">
          <UFormGroup label="Broadcast message" name="message">
            <UTextarea
              v-model="state.message"
              placeholder="Broadcast message"
            />
          </UFormGroup>
        </div>

        <template #footer>
          <UButton
            type="submit"
            color="primary"
            variant="solid"
            label="Send broadcast"
          />
        </template>
      </UModalCard>
    </UForm>
  </UModal>
</template>
