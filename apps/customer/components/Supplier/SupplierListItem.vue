<script setup lang="ts">
defineProps<{
  name: string;
  icon: string;
}>();
</script>

<template>
  <UCard :ui="{ body: { padding: 'sm:p-3 pr-4' } }">
    <div class="flex gap-4 items-center">
      <div class="rounded p-2 bg-gray-100">
        <UIcon :name="icon" class="h-24 w-24" dynamic />
      </div>

      <div class="flex flex-col gap-3 basis-1/4 grow">
        <h2 class="text-lg">{{ name }}</h2>
        <slot name="button" />
      </div>
    </div>
  </UCard>
</template>
