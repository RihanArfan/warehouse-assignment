export const useSupplier = (id: string) => {
  const suppliers = useSuppliers();
  const supplier = computed(() => {
    return suppliers.value.find((s) => {
      return s.id.toLowerCase() === id.toLowerCase();
    })!;
  });
  return supplier;
};
