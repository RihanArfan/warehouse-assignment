<script lang="ts" setup>
const isNewBroadcastOpen = ref(false);
</script>

<template>
  <UButton
    variant="ghost"
    :ui="{
      padding: { sm: 'px-4' },
    }"
    @click="isNewBroadcastOpen = !isNewBroadcastOpen"
  >
    Create broadcast
  </UButton>

  <BroadcastNewModal v-model="isNewBroadcastOpen" />
</template>
