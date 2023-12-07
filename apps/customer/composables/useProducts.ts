export const useProducts = (supplierId: string) => {
  const suppliers = useSuppliers();
  const products = computed(() => {
    const supplier = suppliers.value.find((s) => {
      return s.id.toLowerCase() === supplierId.toLowerCase();
    })!;
    return supplier?.products;
  });
  return products;
};
