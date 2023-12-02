<script setup lang="ts">
import { appWindow } from "@tauri-apps/api/window";

interface Props {
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: "Application",
});

const isMaximized = ref(await appWindow.isMaximized());
await appWindow.onResized(async () => {
  isMaximized.value = await appWindow.isMaximized();
});
</script>

<template>
  <header class="flex justify-between items-center" data-tauri-drag-region>
    <NuxtLink to="/">
      <div
        class="flex my-1.5 mx-4 gap-3 items-center hover:bg-gray-200/75 rounded-lg p-2 transition-colors"
      >
        <img src="../public/icon.png" alt="icon" class="h-5 w-5" />

        <h1 class="text-[0.8rem] text-zinc-800 font-medium">
          {{ title }}
        </h1>
      </div>
    </NuxtLink>

    <div class="grow"><slot name="center" /></div>

    <div>
      <UButton
        icon="i-fluent-subtract-16-regular"
        size="lg"
        color="gray"
        variant="ghost"
        :ui="{
          rounded: '',
          icon: { size: { lg: 'h-4 w-6 my-1.5' } },
          color: { gray: { ghost: 'hover:bg-[#e9e9e9]' } },
        }"
        @click="appWindow.minimize()"
      />

      <UButton
        v-if="!isMaximized"
        icon="i-fluent-maximize-16-regular"
        size="lg"
        color="gray"
        variant="ghost"
        :ui="{ rounded: '', icon: { size: { lg: 'h-4 w-6 my-1.5' } } }"
        class="hover:bg-[#e9e9e9]"
        @click="appWindow.maximize()"
      />

      <UButton
        v-else
        icon="i-fluent-restore-16-regular"
        size="lg"
        color="gray"
        variant="ghost"
        :ui="{ rounded: '', icon: { size: { lg: 'h-4 w-6 my-1.5' } } }"
        class="hover:bg-[#e9e9e9]"
        @click="appWindow.unmaximize()"
      />

      <UButton
        icon="i-fluent-dismiss-24-regular"
        size="lg"
        color="gray"
        variant="ghost"
        :ui="{
          rounded: '',
          icon: { size: { lg: 'h-4 w-6 my-1.5' } },
          color: { gray: { ghost: 'hover:bg-[#e81123] hover:text-white' } },
        }"
        @click="appWindow.close()"
      />
    </div>
  </header>
</template>
