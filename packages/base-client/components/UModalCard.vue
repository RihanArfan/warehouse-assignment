<template>
  <UCard
    :ui="{
      divide: '',
      header: {
        padding: 'py-0 pt-6 pb-3',
      },
      body: {
        padding: 'pb-5 py-0 sm:p-0 sm:px-6 sm:pb-9',
      },
      footer: {
        base: 'border-t-[1.5px] border-[#e5e5e5] flex justify-end gap-1',
        background: 'bg-[#f3f3f3]',
        padding: 'py-6',
      },
    }"
  >
    <slot />

    <!-- passthrough slots -->
    <!-- https://stackoverflow.com/questions/50891858/vue-how-to-pass-down-slots-inside-wrapper-component -->
    <template v-for="(_, slot) of $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </UCard>
</template>
