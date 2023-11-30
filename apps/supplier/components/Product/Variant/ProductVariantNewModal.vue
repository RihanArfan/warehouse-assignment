<script setup lang="ts">
import type { Size } from "types";

const isOpen = defineModel<boolean>();

const form = reactive({
  quantity: "",
  colour: "",
  size: "",
});

const sizes: ReadonlyArray<{ id: Size; value: string }> = [
  { id: "S", value: "Small" },
  { id: "M", value: "Medium" },
  { id: "L", value: "Large" },
] as const;

const sizeCurrent = computed(() => {
  return sizes.find((option) => option.id === form.size);
});

const HALF_SECOND = 500;
watchEffect(() => {
  if (!isOpen.value) {
    setTimeout(() => {
      form.quantity = "";
      form.colour = "";
      form.size = "";
    }, HALF_SECOND);
  }
});
</script>

<template>
  <UModal v-model="isOpen">
    <UModalCard>
      <template #header>
        <h1 class="font-semibold text-lg select-auto">New variant</h1>
        <p class="my-1">Create a new variant</p>
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
        <UButton color="primary" variant="solid" label="Create variant" />
      </template>
    </UModalCard>
  </UModal>
</template>
