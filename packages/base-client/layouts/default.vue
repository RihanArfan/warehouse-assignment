<script setup lang="ts">
interface Props {
  title?: string;
  icon?: string;
  fullscreen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Application",
  fullscreen: false,
});

const containerPadding = computed(() => {
  if (props.fullscreen) {
    return "p-0 lg:px-0";
  }

  return "p-5 sm:py-6 lg:px-10 sm:px-6 sm:pr-3 lg:pr-7";
});
</script>

<template>
  <div class="h-screen flex flex-col select-none bg-[#f3f3f3]">
    <Body class="overscroll-none" />

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
        class="grow bg-[#f9f9f9] min-h-0"
        :class="{
          'border-l border-t border-l-[#e5e5e5] border-t-[#e5e5e5] rounded-tl-lg':
            $slots.sidebar,
        }"
      >
        <UContainer
          :ui="{
            padding: containerPadding,
            constrained: '',
            base: 'h-full overflow-y-auto overscroll-contain',
          }"
          style="scrollbar-gutter: stable"
        >
          <slot />
        </UContainer>
      </div>
    </div>
  </div>
</template>
