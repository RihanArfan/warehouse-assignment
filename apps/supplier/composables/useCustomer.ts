export const useCustomer = (id: string) => {
  const customers = useCustomers();
  const customer = computed(() => {
    return customers.value.find((p) => {
      return p.id.toLowerCase() === id.toLowerCase();
    })!;
  });
  return customer;
};
