<script setup lang="ts">
import type { FormError } from "#ui/types";
import type { Size } from "types";

const route = useRoute("products-product-variants-variant");

const isOpen = ref(true);
watchEffect(() => {
  !isOpen.value &&
    setTimeout(
      () =>
        // TODO: use navigateTo("/products/:product()") - not working currently
        navigateTo({
          name: "products-product",
          params: { product: route.params.product },
        }),
      200
    );
});

const variant = useProductVariant(route.params.product, route.params.variant);

if (!variant.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page Not Found",
  });
}

const state = reactive({
  quantity: variant.value.quantity,
  colour: variant.value.colour,
  size: variant.value.size,
});

const sizes: { id: Size; value: string }[] = [
  { id: "S", value: "Small" },
  { id: "M", value: "Medium" },
  { id: "L", value: "Large" },
];

const sizeCurrent = computed(() => {
  return sizes.find((option) => option.id === state.size);
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.quantity) errors.push({ path: "quantity", message: "Required" });
  if (!state.colour) errors.push({ path: "colour", message: "Required" });
  if (!state.size) errors.push({ path: "size", message: "Required" });
  return errors;
};

async function onSubmit() {
  console.log(state);

  await useInvoke("edit_variant", {
    sku: route.params.variant.toUpperCase(),
    quantity: state.quantity,
    colour: state.colour.toUpperCase(),
    size: state.size,
  });

  variant.value.quantity = state.quantity;
  variant.value.colour = state.colour.toUpperCase();
  variant.value.size = state.size;

  isOpen.value = false;
}

async function onDelete() {
  await useInvoke("delete_variant", {
    sku: route.params.variant.toUpperCase(),
  });

  const products = useProducts();
  const product = products.value.find(
    (product) => product.id === route.params.product.toUpperCase()
  );

  console.log("Product: ", product);

  if (product) {
    product.variants = product.variants.filter(
      (variant) => variant.sku !== route.params.variant.toUpperCase()
    );
  }

  isOpen.value = false;
}
</script>

<template>
  <UModal v-model="isOpen">
    <UForm :validate="validate" :state="state" @submit="onSubmit">
      <UModalCard>
        <template #header>
          <h1 class="font-semibold text-lg select-auto">Edit variant</h1>
          <p class="my-1">Modify a variant</p>
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
