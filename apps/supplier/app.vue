<script setup>
const links = [
  {
    label: "Home",
    icon: "i-fluent-home-32-regular",
    activeIcon: "i-fluent-home-32-filled",
    to: "/",
  },
  {
    label: "Products",
    icon: "i-fluent-apps-24-regular",
    activeIcon: "i-fluent-apps-24-filled",
    to: "/products",
  },
  {
    label: "Messages",
    icon: "i-fluent-chat-24-regular",
    activeIcon: "i-fluent-chat-24-filled",
    to: "/messages",
  },
];

const isCommandPaletteOpen = ref(false);

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      isCommandPaletteOpen.value = !isCommandPaletteOpen.value;
    },
  },
});

const broadcasts = useBroadcasts();
</script>

<template>
  <div>
    <NuxtLoadingIndicator />

    <NuxtLayout
      name="default"
      title="Supplier Portal"
      :fullscreen="$route.meta.fullscreen"
    >
      <template #sidebar>
        <UVerticalNavigation
          :links="links"
          :ui="{
            wrapper: 'mx-1',
            base: 'flex-col justify-center h-[3.75rem] gap-0.5',
            width: 'w-16',
            font: 'font-normal',
            size: 'text-[0.7rem]',
            padding: 'py-1 px-0',
            active: 'before:bg-white',
            inactive: 'hover:before:bg-[#eaeaea]',
            icon: { base: 'w-6 h-6' },
          }"
        >
          <template #icon="{ link, isActive }">
            <UIcon
              v-if="isActive"
              :name="link.activeIcon"
              class="flex-shrink-0 w-6 h-6 text-[#0067c0] dark:text-gray-200"
            />
            <UIcon
              v-else
              :name="link.icon"
              class="flex-shrink-0 w-6 h-6 text-gray-700 dark:text-gray-200"
            />
          </template>

          <template #default="{ link, isActive }">
            <span class="truncate relative" :class="{ hidden: isActive }">
              {{ link.label }}
            </span>
          </template>
        </UVerticalNavigation>
      </template>

      <template #title-bar>
        <div class="flex justify-evenly">
          <span />

          <UInput
            icon="i-heroicons-magnifying-glass-20-solid"
            size="md"
            color="white"
            trailing
            name="input"
            placeholder="Search product SKUs, customers and more"
            readonly
            :ui="{
              color: {
                white: {
                  outline: 'focus:border-b-[#868686] focus:border-b mb-0',
                },
              },
            }"
            class="w-3/5"
            @click.stop.prevent="isCommandPaletteOpen = true"
          />

          <NotificationPopover
            title="Broadcasts"
            icon="i-fluent-megaphone-loud-24-regular"
            class="ml-5"
          >
            <BroadcastList :broadcasts="broadcasts" />

            <template #footer>
              <BroadcastPopoverFooter />
            </template>
          </NotificationPopover>
        </div>
      </template>

      <NuxtPage />

      <UModal v-model="isCommandPaletteOpen"><LazyCommandPalette /></UModal>
    </NuxtLayout>

    <UNotifications />
  </div>
</template>
