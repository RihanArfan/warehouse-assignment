<script setup lang="ts">
const model = defineModel<string>({ required: true });

const colours = useColours();

const onClick = (icon: string, close: Function) => {
  model.value = icon;
  close();
};
</script>

<template>
  <UPopover :popper="{ placement: 'right', arrow: true }">
    <slot />

    <template #panel="{ close }">
      <div class="p-2 w-80">
        <div class="h-64 overflow-y-auto flex flex-col gap-2 mt-2">
          <div class="grid grid-cols-8 text-center">
            <UButton
              v-for="colour of colours"
              :key="colour"
              class="rounded hover:bg-gray-200/75 p-1 h-9 w-9 flex justify-center"
              :class="{
                'bg-primary-100 hover:bg-primary-200/60':
                  model === `i-fluent-emoji-${colour}`,
              }"
              variant="link"
              @click="() => onClick(colour, close)"
            >
              <UTooltip :text="colour">
                <span
                  class="rounded-full grow p-1 opacity-100 h-7 w-7"
                  :style="{ backgroundColor: colour }"
                />
              </UTooltip>
            </UButton>
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>
