<script lang="ts" setup>
import { useFuse } from "@vueuse/integrations/useFuse";
import type { UseFuseOptions } from "@vueuse/integrations";

import type { Product } from "base-client/types/types";

const products = useProducts();
const search = ref("");

const options = computed<UseFuseOptions<Product>>(() => ({
  fuseOptions: {
    keys: [["id"], ["name"], ["variants", "sku"]],
    threshold: 0.2,
  },
  matchAllWhenSearchEmpty: true,
}));

const { results } = useFuse(search, products, options);

const isNewProductOpen = ref(false);
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-7">
      <div class="grow">
        <h1 class="font-semibold text-2xl select-auto mb-2">Products</h1>
        <h2>View your inventory of products and all SKUs</h2>

        <div class="w-1/3 mt-5">
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
      </div>

      <UButton
        color="primary"
        variant="solid"
        label="Create"
        :ui="{ padding: { sm: 'px-8' } }"
        @click="isNewProductOpen = !isNewProductOpen"
      />
    </div>

    <div class="flex flex-col gap-2 my-5">
      <ProductListItem
        v-for="result in results"
        :key="result.item.id"
        :name="result.item.name"
        :icon="{ name: result.item.icon.name }"
      >
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
