<script setup lang="ts">
defineProps<{
  name: string;
  isNameCode?: boolean;
  icon: {
    name: string;
    backgroundColour?: string;
  };
}>();
</script>

<template>
  <UCard :ui="{ body: { padding: 'sm:p-3 pr-4' } }">
    <div class="flex gap-4 items-center justify-between">
      <div class="flex gap-4 items-center basis-1/4">
        <div
          class="rounded p-2 bg-gray-100"
          :class="{ 'opacity-50': !!icon.backgroundColour }"
          :style="{ backgroundColor: icon.backgroundColour }"
        >
          <UIcon :name="icon.name" class="h-8 w-8" dynamic />
        </div>

        <h2>
          <UKbd v-if="isNameCode" class="text-sm">{{ name }}</UKbd>
          <template v-else>
            {{ name }}
          </template>
        </h2>
      </div>

      <div class="flex gap-10 justify-evenly basis-3/6">
        <slot />
      </div>

      <slot name="button" />
    </div>
  </UCard>
</template>
