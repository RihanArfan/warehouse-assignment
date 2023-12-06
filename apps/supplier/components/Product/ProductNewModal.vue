<script setup lang="ts">
import type { FormError } from "#ui/types";

const isOpen = defineModel<boolean>();
const products = useProducts();

const state = reactive({ id: "", name: "", icon: "" });

const HALF_SECOND = 500;
watchEffect(() => {
  if (!isOpen.value) {
    setTimeout(() => {
      state.id = "";
      state.name = "";
      state.icon = "";
    }, HALF_SECOND);
  }
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.id) errors.push({ path: "id", message: "Required" });
  if (!state.name) errors.push({ path: "name", message: "Required" });
  if (!state.icon) errors.push({ path: "icon", message: "Required" });
  return errors;
};

async function onSubmit() {
  useInvoke("create_product", {
    id: state.id,
    name: state.name,
    icon: state.icon,
  });
  products.value.push({
    id: state.id,
    name: state.name,
    icon: state.icon,
    variants: [],
  });

  isOpen.value = false;
}
</script>

<template>
  <UModal v-model="isOpen">
    <UForm :validate="validate" :state="state" @submit="onSubmit">
      <UModalCard>
        <template #header>
          <h1 class="font-semibold text-lg select-auto">New product</h1>
          <p class="my-1">Create a new product</p>
        </template>

        <div class="flex flex-col gap-4">
          <UFormGroup label="Product name" name="name">
            <UInput v-model="state.name" placeholder="T-Shirt" />
          </UFormGroup>

          <UFormGroup label="Product ID" name="id">
            <UInput
              v-model="state.id"
              placeholder="T-SHIRT"
              @keyup="(e: KeyboardEvent) => state.id = state.id.toUpperCase()"
            />
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
                <Icon v-else :name="state.icon" class="h-8 w-8" />
              </div>
            </LazyIconPicker>

            <p class="text-gray-500 capitalize">
              {{ state.icon.replace("i-fluent-emoji-", "").replace("-", " ") }}
            </p>
          </UFormGroup>
        </div>

        <template #footer>
          <UButton
            type="submit"
            color="primary"
            variant="solid"
            label="Create product"
          />
        </template>
      </UModalCard>
    </UForm>
  </UModal>
</template>
