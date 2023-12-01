<script lang="ts" setup>
import { useFuse } from "@vueuse/integrations/useFuse";
import type { UseFuseOptions } from "@vueuse/integrations";

import type { Product } from "types";

const products = useProducts();
const search = ref("");

const sort = ref<(typeof sortOptions)[number]["id"]>("name");
const sortCurrent = computed(() => {
  return sortOptions.find((option) => option.id === sort.value);
});
const sortOptions = [
  { id: "name", name: "Name (A to Z)" },
  { id: "name-desc", name: "Name (Z to A)" },
  { id: "quantity", name: "Quantity (Low to High)" },
  { id: "quantity-desc", name: "Quantity (High to Low)" },
];

const productsWithQuantity = computed(() => {
  return products.value.map((product) => {
    const quantity = product.variants.reduce((acc, variant) => {
      return acc + variant.quantity;
    }, 0);

    return { ...product, quantity };
  });
});

const productsSorted = computed(() => {
  const products = productsWithQuantity.value;

  switch (sort.value) {
    case "name":
      return products.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return products.sort((a, b) => b.name.localeCompare(a.name));
    case "quantity":
      return products.sort((a, b) => a.quantity - b.quantity);
    case "quantity-desc":
      return products.sort((a, b) => b.quantity - a.quantity);
    default:
      return products;
  }
});

const options = computed<UseFuseOptions<Product>>(() => ({
  fuseOptions: {
    keys: [["id"], ["name"], ["variants", "sku"]],
    threshold: 0.2,
  },
  matchAllWhenSearchEmpty: true,
}));

const { results } = useFuse(search, productsSorted, options);

const isNewProductOpen = ref(false);
</script>

<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="grow">
        <h1 class="font-semibold text-2xl select-auto mb-2">Products</h1>
        <h2>View your inventory of products and all SKUs</h2>
      </div>

      <UButton
        color="primary"
        variant="solid"
        label="Create"
        :ui="{ padding: { sm: 'px-8' } }"
        @click="isNewProductOpen = !isNewProductOpen"
      />
    </div>

    <div class="flex justify-between items-center mt-5 mb-7">
      <div class="w-1/3">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          size="md"
          color="white"
          trailing
          name="input"
          placeholder="Search products"
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
        :key="result.item.id"
        :name="result.item.name"
        :icon="{ name: result.item.icon.name }"
      >
        <div class="flex gap-2 items-center basis-1/2">
          <UIcon name="i-fluent-receipt-cube-24-regular" />
          {{ result.item.quantity }}
        </div>

        <div class="flex gap-2 items-center basis-1/2">
          <UIcon name="i-fluent-copy-16-regular" />
          {{ result.item.variants.length }}
        </div>

        <template #button>
          <NuxtLink
            :to="{
              name: 'products-product',
              params: { product: result.item.id.toLowerCase() },
            }"
          >
            <UButton
              color="white"
              variant="solid"
              label="Details"
              :ui="{ padding: { sm: 'px-8' } }"
            />
          </NuxtLink>
        </template>
      </ProductListItem>
    </div>

    <ProductNewModal v-model="isNewProductOpen" />
  </div>
</template>
