<script setup lang="ts">
import type { Product } from "types";

const isOpen = defineModel<boolean>();

// pick id, name, icon
const props = defineProps<{
  product: Pick<Product, "id" | "name" | "icon">;
}>();

const form = reactive({
  id: props.product.id,
  name: props.product.name,
  icon: props.product.icon,
});
</script>

<template>
  <UModal v-model="isOpen">
    <UModalCard>
      <template #header>
        <h1 class="font-semibold text-lg select-auto">Edit product</h1>
        <p class="my-1">Modify a product</p>
      </template>

      <div class="flex flex-col gap-4">
        <UFormGroup label="Product name">
          <UInput v-model="form.name" placeholder="T-Shirt" />
        </UFormGroup>

        <UFormGroup label="Product ID">
          <UInput
            v-model="form.id"
            placeholder="T-SHIRT"
            @keyup="(e: KeyboardEvent) => form.id = form.id.toUpperCase()"
          />
        </UFormGroup>

        <UFormGroup
          label="Product Icon"
          :ui="{ container: 'flex items-center gap-3' }"
        >
          <LazyIconPicker v-model="form.icon">
            <div
              class="rounded p-2 flex h-12 w-12 shadow-sm bg-[#fbfbfb] hover:bg-[#f6f6f6] active:bg-white text-gray-900 ring-0 active:ring-0 border border-b border-[#e5e5e5] active:border-[#e5e5e5] border-b-[#868686] active:border-b-primary-500 active:border-b-2 mb-[4px]"
            >
              <UIcon
                v-if="form.icon === ''"
                name="i-fluent-circle-hint-16-regular"
                class="h-8 w-8 text-gray-500"
              />
              <Icon v-else :name="form.icon" class="h-8 w-8" />
            </div>
          </LazyIconPicker>

          <p class="text-gray-500 capitalize">
            {{ form.icon.replace("i-fluent-emoji-", "").replace("-", " ") }}
          </p>
        </UFormGroup>
      </div>

      <template #footer>
        <UButton color="primary" variant="solid" label="Save changes" />
      </template>
    </UModalCard>
  </UModal>
</template>
