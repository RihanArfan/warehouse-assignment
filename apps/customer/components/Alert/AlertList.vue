<script lang="ts" setup>
const alerts = useAlerts();
const alertsReversed = computed(() => [...alerts.value].reverse());
</script>

<template>
  <div class="flex flex-col max-w-xs max-h-56 overflow-y-auto">
    <div
      v-if="!alerts.length"
      class="items-center justify-center flex w-80 h-56"
    >
      No new notifications
    </div>

    <AlertListItem
      v-for="alert in alertsReversed"
      v-bind="alert"
      :key="alert.date"
    />
  </div>
</template>
