<script lang="ts" setup>
import { useFuse } from "@vueuse/integrations/useFuse";
import type { UseFuseOptions } from "@vueuse/integrations";

import type { ProductVariant } from "types";

definePageMeta({
  validate: async (route) => {
    // @ts-expect-error
    const supplier = useSupplier(route.params.supplier);
    // @ts-expect-error
    const product = useProduct(route.params.product);
    return !!supplier.value && !!product.value;
  },
});

const route = useRoute("suppliers-supplier-products-product");
const supplier = useSupplier(route.params.supplier);
const product = useProduct(route.params.product);

const colours = computed(() => {
  const colours = product.value?.variants.map((variant) => variant.colour);
  return [...new Set(colours)];
});

const search = ref("");

const sort = ref<(typeof sortOptions)[number]["id"]>("colour");
const sortCurrent = computed(() => {
  return sortOptions.find((option) => option.id === sort.value);
});
const sortOptions = [
  { id: "size", name: "Size (Small to Large)" },
  { id: "size-desc", name: "Size (Large to Small)" },
  { id: "quantity", name: "Quantity (Low to High)" },
  { id: "quantity-desc", name: "Quantity (High to Low)" },
  { id: "colour", name: "Colour (A to Z)" },
  { id: "colour-desc", name: "Colour (Z to A)" },
];

const variantsSorted = computed(() => {
  const variants = product.value.variants;

  switch (sort.value) {
    case "size":
      return variants.sort((a, b) => a.size.localeCompare(b.size));
    case "size-desc":
      return variants.sort((a, b) => b.size.localeCompare(a.size));
    case "quantity":
      return variants.sort((a, b) => a.quantity - b.quantity);
    case "quantity-desc":
      return variants.sort((a, b) => b.quantity - a.quantity);
    case "colour":
      return variants.sort((a, b) => a.colour.localeCompare(b.colour));
    case "colour-desc":
      return variants.sort((a, b) => b.colour.localeCompare(a.colour));
    default:
      return variants;
  }
});

const options = computed<UseFuseOptions<ProductVariant>>(() => ({
  fuseOptions: {
    keys: [["sku"], ["colour"], ["size"]],
    threshold: 0.2,
  },
  matchAllWhenSearchEmpty: true,
}));

const { results } = useFuse(search, variantsSorted, options);

const isSubscribed = ref(false);
</script>

<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="flex justify-stretch items-center gap-10 grow">
        <div class="bg-gray-200/50 rounded-lg p-4 w-44 text-center">
          <UIcon :name="product.icon" class="text-9xl" dynamic />
        </div>

        <div>
          <SupplierBadge v-bind="supplier" />

          <h1 class="font-semibold text-4xl select-auto mb-3 mt-2">
            {{ product.name }}
            <span class="font-normal text-2xl">
              {{ product.variants.length }} variants
            </span>
          </h1>

          <div class="flex">
            <div
              v-for="(colour, i) in colours"
              :key="colour"
              class="bg-white rounded-full relative"
              :class="{ '-ml-2': i !== 0 }"
            >
              <div
                class="w-8 h-8 rounded-full opacity-50"
                :style="{ backgroundColor: colour }"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <UButton
          v-if="!isSubscribed"
          color="primary"
          variant="solid"
          icon="i-fluent-alert-16-regular"
          label="Subscribe to updates"
          :ui="{ padding: { sm: 'pr-4 pl-3' } }"
          @click="isSubscribed = !isSubscribed"
        />
        <UButton
          v-else
          color="white"
          variant="solid"
          icon="i-fluent-checkmark-16-regular"
          label="Subscribed to updates"
          :ui="{ padding: { sm: 'pr-4 pl-3' } }"
          @click="isSubscribed = !isSubscribed"
        />
      </div>
    </div>

    <div class="flex justify-between items-center mt-10 mb-7">
      <div class="w-1/3">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          size="md"
          color="white"
          trailing
          name="input"
          placeholder="Search SKUs"
          :ui="{}"
        />
      </div>

      <div class="flex gap-1 items-center text-sm text-gray-500">
        <UIcon name="i-fluent-arrow-sort-16-regular" />
        <p class="text-sm text-gray-500">Sort by:</p>

        <USelectMenu
          v-model="sort"
          :options="sortOptions"
          value-attribute="id"
          option-attribute="name"
          class="ml-1"
        >
          <template #label>
            {{ sortCurrent!.name }}
          </template>
        </USelectMenu>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <ProductListItem
        v-for="result in results"
        :key="result.item.sku"
        :name="result.item.sku"
        :is-name-code="true"
        :icon="{
          name: product.icon,
          backgroundColour: result.item.colour,
        }"
      >
        <div class="flex gap-2 items-center basis-1/3">
          <UIcon name="i-fluent-receipt-cube-24-regular" />
          {{ result.item.quantity }}
        </div>

        <div class="flex gap-2 items-center basis-1/3">
          <UIcon name="i-fluent-paint-bucket-24-regular" />
          {{ result.item.colour }}
        </div>

        <div class="flex gap-2 items-center basis-1/3">
          <UIcon name="i-fluent-slide-size-24-regular" />
          {{ result.item.size }}
        </div>

        <template #button>
          <!-- <NuxtLink
            :to="{
              name: 'products-product-variants-variant',
              params: {
                product: product.id.toLowerCase(),
                variant: result.item.sku.toLowerCase(),
              },
            }"
          > -->
          <UButton
            color="white"
            variant="solid"
            label="Inquire"
            :ui="{ padding: { sm: 'px-8' } }"
          />
          <!-- </NuxtLink> -->
        </template>
      </ProductListItem>
    </div>

    <NuxtPage />
  </div>
</template>
