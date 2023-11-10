<script setup lang="ts">
const isOpen = defineModel<boolean>();
</script>

<template>
  <UModal v-model="isOpen">
    <UModalCard>
      <template #header>
        <h1 class="font-semibold text-lg select-auto">New broadcast</h1>
        <p class="my-1">Send a broadcast to all customers</p>
      </template>

      <div class="flex flex-col gap-4">
        <UFormGroup label="Broadcast message">
          <UTextarea placeholder="Broadcast message" />
        </UFormGroup>
      </div>

      <template #footer>
        <UButton color="primary" variant="solid" label="Send broadcast" />
      </template>
    </UModalCard>
  </UModal>
</template>
