<script setup lang="ts">
import type { FormError } from "#ui/types";
import type { Product } from "types";

const props = defineProps<{ product: Pick<Product, "id" | "name" | "icon"> }>();
const isOpen = defineModel<boolean>();
const products = useProducts();

const state = reactive({
  name: props.product.name,
  icon: props.product.icon,
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.name) errors.push({ path: "name", message: "Required" });
  return errors;
};

async function onSubmit() {
  useInvoke("edit_product", {
    id: props.product.id,
    name: state.name,
    icon: state.icon,
  });

  const product = products.value.find((p) => p.id === props.product.id)!;
  product.name = state.name;
  product.icon = state.icon;

  isOpen.value = false;
}

async function onDelete() {
  useInvoke("delete_product", {
    id: props.product.id.toUpperCase(),
  });

  products.value = products.value.filter(
    (product) => product.id !== props.product.id.toUpperCase()
  );

  navigateTo("/products");
}
</script>

<template>
  <UModal v-model="isOpen">
    <UForm :validate="validate" :state="state" @submit="onSubmit">
      <UModalCard>
        <template #header>
          <h1 class="font-semibold text-lg select-auto">Edit product</h1>
          <p class="my-1">Modify a product</p>
        </template>

        <div class="flex flex-col gap-4">
          <UFormGroup label="Product name" name="name">
            <UInput v-model="state.name" :placeholder="product.id" />
          </UFormGroup>

          <UFormGroup label="Product ID">
            <UInput :model-value="product.id" disabled />
          </UFormGroup>

          <UFormGroup
            label="Product Icon"
            :ui="{ container: 'flex items-center gap-3' }"
          >
            <LazyIconPicker v-model="state.icon">
              <div
                class="rounded p-2 flex h-12 w-12 shadow-sm bg-[#fbfbfb] hover:bg-[#f6f6f6] active:bg-white text-gray-900 ring-0 active:ring-0 border border-b border-[#e5e5e5] active:border-[#e5e5e5] border-b-[#868686] active:border-b-primary-500 active:border-b-2 mb-[4px]"
              >
                <UIcon
                  v-if="state.icon === ''"
                  name="i-fluent-circle-hint-16-regular"
                  class="h-8 w-8 text-gray-500"
                />
                <UIcon v-else :name="state.icon" class="h-8 w-8" dynamic />
              </div>
            </LazyIconPicker>

            <p class="text-gray-500 capitalize">
              {{ state.icon.replace("i-fluent-emoji-", "").replace("-", " ") }}
            </p>
          </UFormGroup>
        </div>

        <template #footer>
          <UButton
            color="red"
            variant="link"
            label="Delete"
            @click="onDelete"
          />

          <UButton
            type="submit"
            color="primary"
            variant="solid"
            label="Save changes"
          />
        </template>
      </UModalCard>
    </UForm>
  </UModal>
</template>
