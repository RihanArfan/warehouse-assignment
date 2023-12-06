<script setup lang="ts">
const suppliers = useSuppliers();
</script>

<template>
  <div>
    <div>
      <h1 class="font-semibold text-2xl select-auto mb-2">Suppliers</h1>
      <h2>View your suppliers, along with their products and broadcasts</h2>
    </div>

    <div class="flex justify-between items-center mt-5 mb-7">
      <div class="w-1/3">
        <UInput
          icon="i-heroicons-magnifying-glass-20-solid"
          size="md"
          color="white"
          trailing
          name="input"
          placeholder="Search suppliers"
          :ui="{}"
        />
      </div>
    </div>

    <div class="grid grid-cols-3 gap-2">
      <SupplierListItem
        v-for="supplier in suppliers"
        :key="supplier.id"
        :name="supplier.name"
        :icon="supplier.icon"
      >
        <template #button>
          <NuxtLink
            :to="{
              name: 'suppliers-supplier',
              params: { supplier: supplier.id.toLowerCase() },
            }"
          >
            <UButton
              color="white"
              variant="solid"
              label="View supplier"
              :ui="{ padding: { sm: 'px-4' } }"
            />
          </NuxtLink>
        </template>
      </SupplierListItem>
    </div>
  </div>
</template>
