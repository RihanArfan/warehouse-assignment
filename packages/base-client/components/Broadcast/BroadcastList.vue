<script lang="ts" setup>
import type { Broadcast } from "types";

const props = defineProps<{
  broadcasts: Broadcast[];
}>();

const broadcastReversed = computed(() => {
  return props.broadcasts.slice().reverse();
});
</script>

<template>
  <div class="flex flex-col max-w-xs max-h-56 overflow-y-auto">
    <BroadcastListItem
      v-for="broadcast in broadcastReversed"
      :key="broadcast.date"
      v-bind="broadcast"
    />
  </div>
</template>
