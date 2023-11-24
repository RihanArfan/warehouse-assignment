export const useProductVariant = (productId: string, sku: string) => {
  const product = useProduct(productId);
  const variant = computed(() => {
    return product.value?.variants.find(
      (variant) => variant.sku.toLowerCase() === sku.toLowerCase()
    )!;
  });
  return variant;
};
