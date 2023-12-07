<script setup lang="ts">
const props = defineProps<{
  date: string;
  icon: string;
  type: string;
  message: string;
}>();

const timeAgo = useTimeAgo(new Date(props.date));
</script>

<template>
  <div class="rounded hover:bg-gray-100/50 px-3 py-2">
    <h2 class="text-gray-500 text-xs flex gap-1 items-center mb-0.5">
      <UIcon :name="icon" dynamic /> {{ type }} • {{ timeAgo }}
    </h2>

    <p class="text-sm">{{ message }}</p>
  </div>
</template>
