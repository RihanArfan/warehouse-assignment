<script setup lang="ts">
const isOpen = defineModel<boolean>();

const people = ["John Egbert", "Jade Harley", "Dave Strider"];
const selected = ref([]);
</script>

<template>
  <UModal v-model="isOpen">
    <UModalCard>
      <template #header>
        <h1 class="font-semibold text-lg select-auto">New message</h1>
      </template>

      <div class="flex flex-col gap-4">
        <UFormGroup label="Customers">
          <USelectMenu
            v-model="selected"
            :options="people"
            multiple
            searchable
            size="md"
            placeholder="Select customers"
          />
        </UFormGroup>

        <UFormGroup label="Message">
          <UInput placeholder="Message" size="md" />
        </UFormGroup>
      </div>

      <template #footer>
        <UButton color="primary" variant="solid" label="Send message" />
      </template>
    </UModalCard>
  </UModal>
</template>
