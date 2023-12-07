export const useProduct = (supplierId: string, productId: string) => {
  const subscribedProducts = useSubscribedProducts();

  const products = useProducts(supplierId);
  const product = computed(() => {
    const product = products.value.find((p) => {
      return p.id.toLowerCase() === productId.toLowerCase();
    })!;

    return {
      ...product,
      isSubscribed: subscribedProducts.value.includes(product.id),
    };
  });
  return product;
};
