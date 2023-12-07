<script setup>
const commandPaletteRef = ref();
const isDebug = useIsDebug();

const customers = [
  {
    id: "rihanarfan",
    label: "RihanArfan",
    href: "https://github.com/RihanArfan",
    avatar: { src: "https://github.com/RihanArfan.png" },
  },
];

const actions = [
  {
    id: "toggle-debug",
    label: isDebug.value
      ? "Disable debug notifications"
      : "Enable debug notifications",
    icon: "i-fluent-code-block-16-filled",
    click: () => (isDebug.value = !isDebug.value),
  },
];

const groups = computed(() =>
  [
    commandPaletteRef.value?.query
      ? {
          key: "customers",
          commands: customers,
        }
      : {
          key: "recent",
          label: "Recent searches",
          commands: customers.slice(0, 1),
        },
    {
      key: "actions",
      commands: actions,
    },
  ].filter(Boolean)
);

function onSelect(option) {
  if (option.click) {
    option.click();
  } else if (option.to) {
    navigateTo(option.to);
  } else if (option.href) {
    navigateTo(option.href, { open: { target: "_blank" } });
  }
}
</script>

<template>
  <UCommandPalette
    ref="commandPaletteRef"
    :groups="groups"
    placeholder="Search product SKUs, customers and more"
    @update:model-value="onSelect"
  />
</template>
