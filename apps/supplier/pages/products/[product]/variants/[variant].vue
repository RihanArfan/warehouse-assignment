<script setup lang="ts">
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

const form = reactive({
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
  return sizes.find((option) => option.id === form.size);
});
</script>

<template>
  <UModal v-model="isOpen">
    <UModalCard>
      <template #header>
        <h1 class="font-semibold text-lg select-auto">Edit variant</h1>
        <p class="my-1">Modify a variant</p>
      </template>

      <div class="flex flex-col gap-4">
        <UFormGroup label="Quantity">
          <UInput v-model="form.quantity" placeholder="50" type="number" />
        </UFormGroup>

        <UFormGroup label="Size">
          <USelectMenu
            v-model="form.size"
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
          <ColourPicker v-model="form.colour">
            <div
              class="rounded p-2 flex justify-center h-12 w-12 shadow-sm bg-[#fbfbfb] hover:bg-[#f6f6f6] active:bg-white text-gray-900 ring-0 active:ring-0 border border-b border-[#e5e5e5] active:border-[#e5e5e5] border-b-[#868686] active:border-b-primary-500 active:border-b-2 mb-[4px]"
            >
              <span
                v-if="form.colour === ''"
                class="rounded-lg grow p-1 opacity-50 bg-gray-500"
              />
              <span
                v-else
                class="rounded-lg grow p-1 opacity-50"
                :style="{ backgroundColor: form.colour }"
              />
            </div>
          </ColourPicker>

          <p class="text-gray-500">
            {{ form.colour }}
          </p>
        </UFormGroup>
      </div>

      <template #footer>
        <UButton color="primary" variant="solid" label="Save changes" />
      </template>
    </UModalCard>
  </UModal>
</template>
