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
</script>

<template>
  <div>
    <NuxtLoadingIndicator />

    <NuxtLayout
      name="default"
      title="Customer Portal"
      :fullscreen="$route.meta.fullscreen"
    >
      <template #title-bar>
        <div class="flex justify-between pl-0">
          <UButton
            color="white"
            variant="ghost"
            size="md"
            icon="i-fluent-arrow-left-16-regular"
            :ui="{ padding: { sm: 'px-2' } }"
            class="text-gray-500"
            @click="$router.back()"
          />

          <div class="flex justify-evenly grow">
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

            <NotificationPopover class="ml-5">
              <AlertList />
            </NotificationPopover>
          </div>
        </div>
      </template>

      <NuxtPage />

      <UModal v-model="isCommandPaletteOpen"><LazyCommandPalette /></UModal>
    </NuxtLayout>

    <UNotifications />
  </div>
</template>
