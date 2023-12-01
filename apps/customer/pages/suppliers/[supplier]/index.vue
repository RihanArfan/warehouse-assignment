<script lang="ts" setup>
import { useFuse } from "@vueuse/integrations/useFuse";
import type { UseFuseOptions } from "@vueuse/integrations";

import type { Product } from "types";

definePageMeta({
  validate: async (route) => {
    // @ts-expect-error
    const supplier = useSupplier(route.params.supplier);
    return !!supplier.value;
  },
});

const route = useRoute("suppliers-supplier");
const search = ref("");

const supplier = useSupplier(route.params.supplier);
const products = computed(() => supplier.value?.products);

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
</script>

<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="flex justify-stretch items-center gap-10 grow">
        <div class="bg-gray-200/50 rounded-lg p-4 w-44 text-center">
          <UIcon :name="supplier.icon" class="text-9xl" />
        </div>

        <div class="flex flex-col gap-3">
          <h1 class="font-semibold text-4xl select-auto">
            {{ supplier.name }}
          </h1>

          <div class="flex font-normal text-xl">
            {{ supplier.description }}
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <NotificationPopover
          title="Broadcasts"
          icon="i-fluent-megaphone-loud-24-regular"
          class="ml-5"
        >
          <template #button>
            <UButton
              color="white"
              variant="solid"
              icon="i-fluent-megaphone-loud-16-regular"
              :ui="{ padding: { sm: 'px-8' } }"
            />
          </template>

          <BroadcastList :broadcasts="supplier.broadcasts" />
        </NotificationPopover>

        <UButton color="primary" variant="solid" label="Send message" />
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
        :icon="{
          name: result.item.icon.name,
        }"
      >
        <div class="flex gap-2 items-center basis-1/3">
          <UIcon name="i-fluent-receipt-cube-24-regular" />
          {{ result.item.quantity }}
        </div>

        <template #button>
          <NuxtLink
            :to="{
              name: 'suppliers-supplier-products-product',
              params: {
                supplier: supplier.id.toLowerCase(),
                product: result.item.id.toLowerCase(),
              },
            }"
          >
            <UButton
              color="white"
              variant="solid"
              label="View details"
              :ui="{ padding: { sm: 'px-4' } }"
            />
          </NuxtLink>
        </template>
      </ProductListItem>
    </div>

    <NuxtPage />
  </div>
</template>
