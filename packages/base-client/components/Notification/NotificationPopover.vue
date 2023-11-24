<script setup lang="ts">
interface Props {
  title?: string;
  icon?: string;
}

withDefaults(defineProps<Props>(), {
  title: "Alerts",
  icon: "i-fluent-alert-16-regular",
});
</script>

<template>
  <UPopover :popper="{ arrow: true }">
    <UButton
      color="white"
      size="md"
      :icon="icon"
      :ui="{ rounded: 'rounded-full' }"
    />

    <template #panel>
      <UCard
        :ui="{
          divide: '',
          header: {
            padding: 'py-0 pt-4 pb-1',
          },
          body: {
            padding: 'pb-3 py-0 sm:p-0 sm:px-3 sm:pb-4',
          },
          footer: {
            base: 'border-t-[1.5px] border-[#e5e5e5] flex justify-end gap-1',
            background: 'bg-[#f3f3f3]',
            padding: 'py-3 sm:px-3',
          },
        }"
      >
        <template #header>
          <h1 class="font-semibold text-lg select-auto">{{ title }}</h1>
        </template>

        <slot />

        <template v-if="$slots.footer" #footer>
          <slot name="footer" />
        </template>
      </UCard>
    </template>
  </UPopover>
</template>
