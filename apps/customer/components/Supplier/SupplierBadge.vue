<script setup lang="ts">
import type { Supplier } from "types";

defineProps<Pick<Supplier, "id" | "name" | "icon">>();
</script>

<template>
  <NuxtLink
    :to="{
      name: 'suppliers-supplier',
      params: { supplier: id.toLowerCase() },
    }"
    class="flex gap-2 rounded-full border border-gray-300 max-w-fit pr-3 pl-2 py-0.5 text-sm text-gray-700 hover:bg-gray-100"
  >
    <UIcon :name="icon" class="text-lg" dynamic />
    {{ name }}
  </NuxtLink>
</template>
