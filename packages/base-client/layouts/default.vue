<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "Application",
  },
});
</script>

<template>
  <div class="h-screen flex flex-col select-none bg-[#f3f3f3]">
    <TitleBar
      :title="title"
      :class="{
        'border-b border-b-[#e5e5e5]': !$slots.sidebar,
      }"
    >
      <template #center>
        <slot name="title-bar" />
      </template>
    </TitleBar>

    <div class="flex grow min-h-0">
      <div>
        <slot name="sidebar"></slot>
      </div>

      <div
        class="grow bg-[#f9f9f9] overflow-y-auto min-h-0"
        :class="{
          'border-l border-t border-l-[#e5e5e5] border-t-[#e5e5e5] rounded-tl-lg':
            $slots.sidebar,
        }"
      >
        <UContainer :ui="{ padding: 'p-5 sm:py-6 lg:px-10', constrained: '' }">
          <slot />
        </UContainer>
      </div>
    </div>
  </div>
</template>
