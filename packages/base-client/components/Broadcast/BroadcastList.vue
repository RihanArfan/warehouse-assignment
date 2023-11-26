<script lang="ts" setup>
import type { Broadcast } from "../../types/types";

defineProps<{
  broadcasts: Broadcast[];
}>();
</script>

<template>
  <div class="flex flex-col max-w-xs">
    <BroadcastListItem
      v-for="broadcast in broadcasts"
      :key="broadcast.date"
      v-bind="broadcast"
    />
  </div>
</template>
