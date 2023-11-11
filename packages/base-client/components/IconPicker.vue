<script setup lang="ts">
import { metadata } from "@iconify-json/fluent-emoji";

const model = defineModel<string>({ required: true });

// remove different variations of the same icon
// loading "people" with variations kills the browser as it fetches and loads every svg remotely
const unneededIconTypes = [
  "-dark",
  "-light",
  "-medium",
  "-medium-dark",
  "-medium-light",
];

const metadataSimplified = computed(() => {
  const simplified: { category: string; icons: string[] }[] = [];

  for (const [category, icons] of Object.entries(metadata.categories!)) {
    const iconsFiltered = [];

    for (const icon of icons) {
      if (!unneededIconTypes.some((type) => icon.endsWith(type))) {
        iconsFiltered.push(icon);
      }
    }

    simplified.push({
      category,
      icons: iconsFiltered,
    });
  }

  return simplified;
});

const query = ref("");
const queryDebounced = refDebounced(query, 250); // debounce to avoid computing on every keypress

// convert the search query to kebab case to match the icon names
const iconQuery = computed(() => {
  const lowercase = queryDebounced.value.toLowerCase();
  const kebabCase = lowercase.replace(/ /g, "-");
  return kebabCase;
});

// memoize the search results to prevent re-computing the same results
const getIconsByQuery = useMemoize((query: string) => {
  if (query.length < 3) return [];

  const filtered: { category: string; icons: string[] }[] = [];

  for (const category of metadataSimplified.value) {
    const icons: string[] = [];

    for (const icon of category.icons) {
      if (icon.includes(query)) {
        icons.push(icon);
      }
    }

    if (icons.length === 0) continue;

    filtered.push({
      category: category.category,
      icons,
    });
  }

  return filtered;
});

const filteredIcons = computed(() => getIconsByQuery(iconQuery.value));

// TODO: use virtual list - https://vuejs.org/guide/best-practices/performance.html#virtualize-large-lists
// rendering large number of complex SVG icons makes DOM massive and very difficult for the browser.
// making icons bigger amd only rendering icons visible on screen will increase performance.

const onClick = (icon: string, close: Function) => {
  model.value = `i-fluent-emoji-${icon}`;
  close();
  query.value = "";
};
</script>

<template>
  <UPopover :popper="{ placement: 'right', arrow: true }">
    <slot />

    <template #panel="{ close }">
      <div class="p-2 w-80">
        <div class="h-9">
          <UInput
            v-model="query"
            icon="i-heroicons-magnifying-glass-20-solid"
            size="sm"
            color="white"
            placeholder="Search icons"
            autofocus
          />
        </div>

        <div class="h-64 overflow-y-auto flex flex-col gap-2 mt-2">
          <div
            v-if="query.length < 3"
            class="flex flex-col items-center justify-center h-full w-full gap-2"
          >
            <UIcon name="i-fluent-search-20-regular" class="text-4xl" />
            <div class="text-center">
              <p class="text-gray-500">Search for an icon</p>
              <p class="text-xs text-gray-400">3+ characters</p>
            </div>
          </div>

          <div
            v-for="category of filteredIcons"
            v-else
            :key="category.category"
          >
            <p class="text-gray-500 font-semibold text-sm mb-1">
              {{ category.category }}
            </p>

            <div class="grid grid-cols-8 text-center">
              <UButton
                v-for="icon of category.icons"
                :key="icon"
                class="rounded hover:bg-gray-200/75 p-1 h-9 w-9"
                :class="{
                  'bg-primary-100 hover:bg-primary-200/60':
                    model === `i-fluent-emoji-${icon}`,
                }"
                variant="link"
                @click="() => onClick(icon, close)"
              >
                <UTooltip :text="icon">
                  <Icon
                    :name="`i-fluent-emoji-${icon}`"
                    class="h-7 w-7"
                    :title="icon"
                  />
                </UTooltip>
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>
