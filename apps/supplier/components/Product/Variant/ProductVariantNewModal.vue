<script setup lang="ts">
import type { FormError } from "#ui/types";
import type { ProductVariant, Size } from "types";

const props = defineProps<{ productId: string }>();
const isOpen = defineModel<boolean>();
const products = useProducts();

const state = reactive<{
  quantity: string;
  colour: string;
  size: Size | "";
}>({
  quantity: "",
  colour: "",
  size: "",
});

const sizes: { id: Size; value: string }[] = [
  { id: "S", value: "Small" },
  { id: "M", value: "Medium" },
  { id: "L", value: "Large" },
];

const sizeCurrent = computed(() => {
  return sizes.find((option) => option.id === state.size);
});

const HALF_SECOND = 500;
watchEffect(() => {
  if (!isOpen.value) {
    setTimeout(() => {
      state.quantity = "";
      state.colour = "";
      state.size = "";
    }, HALF_SECOND);
  }
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.quantity) errors.push({ path: "quantity", message: "Required" });
  if (!state.colour) errors.push({ path: "colour", message: "Required" });
  if (!state.size) errors.push({ path: "size", message: "Required" });
  return errors;
};

async function onSubmit() {
  useInvoke("create_variant", {
    productId: props.productId,
    quantity: parseInt(state.quantity),
    colour: state.colour,
    size: state.size,
  });

  // push variant to product
  const product = products.value.find(
    (product) => product.id === props.productId
  );

  if (product) {
    product.variants.push({
      sku: `${props.productId}-${state.colour}-${state.size}`,
      quantity: parseInt(state.quantity),
      colour: state.colour.toUpperCase(),
      // @ts-expect-error
      size: state.size,
    });
  }

  isOpen.value = false;
}
</script>

<template>
  <UModal v-model="isOpen">
    <UForm :validate="validate" :state="state" @submit="onSubmit">
      <UModalCard>
        <template #header>
          <h1 class="font-semibold text-lg select-auto">New variant</h1>
          <p class="my-1">Create a new variant</p>
        </template>

        <div class="flex flex-col gap-4">
          <UFormGroup label="Quantity" name="quantity">
            <UInput v-model="state.quantity" placeholder="50" type="number" />
          </UFormGroup>

          <UFormGroup label="Size" name="size">
            <USelectMenu
              v-model="state.size"
              :options="sizes"
              value-attribute="id"
              option-attribute="value"
            >
              <template #label>
                <template v-if="!sizeCurrent">Select a size</template>
                <template v-else>{{ sizeCurrent.value }}</template>
              </template>
            </USelectMenu>
          </UFormGroup>

          <UFormGroup
            label="Colour"
            :ui="{ container: 'flex items-center gap-3' }"
          >
            <ColourPicker v-model="state.colour">
              <div
                class="rounded p-2 flex justify-center h-12 w-12 shadow-sm bg-[#fbfbfb] hover:bg-[#f6f6f6] active:bg-white text-gray-900 ring-0 active:ring-0 border border-b border-[#e5e5e5] active:border-[#e5e5e5] border-b-[#868686] active:border-b-primary-500 active:border-b-2 mb-[4px]"
              >
                <span
                  v-if="state.colour === ''"
                  class="rounded-lg grow p-1 opacity-50 bg-gray-500"
                />
                <span
                  v-else
                  class="rounded-lg grow p-1 opacity-50"
                  :style="{ backgroundColor: state.colour }"
                />
              </div>
            </ColourPicker>

            <p class="text-gray-500">
              {{ state.colour }}
            </p>
          </UFormGroup>
        </div>

        <template #footer>
          <UButton
            type="submit"
            color="primary"
            variant="solid"
            label="Create variant"
          />
        </template>
      </UModalCard>
    </UForm>
  </UModal>
</template>
