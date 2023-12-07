<script setup>
const isCommandPaletteOpen = ref(false);

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      isCommandPaletteOpen.value = !isCommandPaletteOpen.value;
    },
  },
});

useEvents();

const isUnreadAlerts = useIsUnreadAlerts();
</script>

<template>
  <div>
    <NuxtLoadingIndicator />

    <NuxtPage v-if="$route.path === '/login'" />
    <NuxtLayout v-else name="default" :fullscreen="$route.meta.fullscreen">
      <template #title-bar>
        <div class="flex justify-between pl-0" data-tauri-drag-region>
          <UButton
            color="white"
            variant="ghost"
            size="md"
            icon="i-fluent-arrow-left-16-regular"
            :ui="{ padding: { sm: 'px-2' } }"
            class="text-gray-500"
            @click="$router.back()"
          />

          <div class="flex justify-evenly grow" data-tauri-drag-region>
            <UInput
              icon="i-heroicons-magnifying-glass-20-solid"
              size="md"
              color="white"
              trailing
              name="input"
              placeholder="Search suppliers, products and more"
              readonly
              :ui="{
                color: {
                  white: {
                    outline: 'focus:border-b-[#868686] focus:border-b mb-0',
                  },
                },
              }"
              class="w-4/6"
              @click.stop.prevent="isCommandPaletteOpen = true"
            />

            <NotificationPopover class="ml-3">
              <AlertList />
            </NotificationPopover>

            <RouterLink to="/messages">
              <UChip inset :show="isUnreadAlerts" class="-ml-5">
                <UButton
                  color="white"
                  size="md"
                  icon="i-fluent-chat-16-regular"
                  :ui="{ rounded: 'rounded-full' }"
                  @click="isUnreadAlerts = false"
                />
              </UChip>
            </RouterLink>
          </div>
        </div>
      </template>

      <NuxtPage />

      <UModal v-model="isCommandPaletteOpen"><LazyCommandPalette /></UModal>
    </NuxtLayout>

    <UNotifications />
  </div>
</template>
