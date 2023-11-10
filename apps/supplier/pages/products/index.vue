<script lang="ts" setup>
import { useFuse } from "@vueuse/integrations/useFuse";
import type { UseFuseOptions } from "@vueuse/integrations";

import type { Product } from "base-client/types/types";

const products = useProducts();
const search = ref("");

const options = computed<UseFuseOptions<Product>>(() => ({
  fuseOptions: {
    keys: [["id"], ["product_name"], ["variants", "sku"]],
    threshold: 0.2,
  },
  matchAllWhenSearchEmpty: true,
}));

const { results } = useFuse(search, products, options);
</script>

<template>
  <div>
    <h1 class="font-semibold text-2xl select-auto mb-2">Products</h1>
    <h2>View your inventory of products and all SKUs</h2>

    <div class="w-1/3 mb-7 mt-5">
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

    <div class="flex flex-col gap-2 my-5">
      <div v-for="result in results" :key="result.item.id">
        <UCard :ui="{ body: { padding: 'sm:p-3' } }">
          <div class="flex gap-4 items-center justify-between">
            <div class="flex gap-4 items-center">
              <div class="bg-gray-100 rounded p-2">
                <img :src="result.item.icon.url" class="h-8 w-8" />
              </div>

              <h2>{{ result.item.product_name }}</h2>
            </div>

            <div class="mr-4">
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
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
