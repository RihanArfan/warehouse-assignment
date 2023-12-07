export const useProduct = (supplierId: string, productId: string) => {
  const products = useProducts(supplierId);
  const product = computed(() => {
    return products.value.find((p) => {
      return p.id.toLowerCase() === productId.toLowerCase();
    })!;
  });
  return product;
};
