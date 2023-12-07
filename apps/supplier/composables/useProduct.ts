export const useProduct = (id: string) => {
  const products = useProducts();
  const product = computed(() => {
    return products.value.find((p) => {
      return p.id.toLowerCase() === id.toLowerCase();
    })!;
  });
  return product;
};
