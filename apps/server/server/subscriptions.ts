import { getCustomer } from "../customer/customer.ts";
import { getSupplier } from "../supplier/supplier.ts";

// function for sending product stock updates to customers every X minutes
// get minutes from variable PRODUCT_STOCK_NOTIFICATION_INTERVAL

// use setInterval to call this function every X minutes
function sendProductNotifications(customerId: string, connection: Deno.Conn) {
  // for every supplier of the customer, we need to get the products they're subscribed to
  // then send STOCK_UPDATE to the customer including the product id and the new stock level

  // get customer
  const customer = getCustomer(customerId);
  if (!customer) throw new Error("customer not found");

  // get all suppliers of the customer
  const suppliers = customer.suppliers.map((supplierId) =>
    getSupplier(supplierId)
  );

  // get all products of the suppliers which the customer is subscribed to. customer.subscribedProducts is an array of product ids
  const products = suppliers.flatMap((supplier) => {
    return supplier?.products.filter((product) =>
      customer.subscribedProducts.includes(product.id)
    );
  });
}

// send customers new stock at the end of the day
// get the time from variable PRODUCT_REFRESH_INTERVAL
function sendProducts(customerId: string, connection: Deno.Conn) {
  // for every supplier of the customer, we need to get the products they're subscribed to
  // then send STOCK_UPDATE to the customer including the product id and the new stock level
}
