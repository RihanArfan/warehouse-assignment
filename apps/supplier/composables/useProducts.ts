import type { Product } from "~/types/types";

export const useProducts = () => {
  return useState<Product[]>("products", () => [
    {
      id: "TSHIRT",
      product_name: "T-Shirt",
      icon: {
        url: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/16cf45a09e7baaeb5bca72bfe569fe5d3ff03c83/assets/T-shirt/Color/t-shirt_color.svg",
        colour: "#83dc8a",
      },
      variants: [
        {
          sku: "TSHIRT-RED-S",
          colour: "Red",
          size: "S",
          quantity: 10,
        },
        {
          sku: "TSHIRT-RED-M",
          colour: "Red",
          size: "M",
          quantity: 5,
        },
        {
          sku: "TSHIRT-RED-L",
          colour: "Red",
          size: "L",
          quantity: 3,
        },
        {
          sku: "TSHIRT-BLUE-S",
          colour: "Blue",
          size: "S",
          quantity: 10,
        },
        {
          sku: "TSHIRT-BLUE-M",
          colour: "Blue",
          size: "M",
          quantity: 5,
        },
        {
          sku: "TSHIRT-BLUE-L",
          colour: "Blue",
          size: "L",
          quantity: 3,
        },
        {
          sku: "TSHIRT-GREEN-S",
          colour: "Green",
          size: "S",
          quantity: 10,
        },
        {
          sku: "TSHIRT-GREEN-M",
          colour: "Green",
          size: "M",
          quantity: 5,
        },
        {
          sku: "TSHIRT-GREEN-L",
          colour: "Green",
          size: "L",
          quantity: 3,
        },
      ],
    },

    {
      id: "SHORTS",
      product_name: "Shorts",
      icon: {
        url: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/16cf45a09e7baaeb5bca72bfe569fe5d3ff03c83/assets/Shorts/Color/shorts_color.svg",
        colour: "#4ee297",
      },
      variants: [
        {
          sku: "SHORTS-RED-S",
          colour: "Red",
          size: "S",
          quantity: 10,
        },
        {
          sku: "SHORTS-RED-M",
          colour: "Red",
          size: "M",
          quantity: 5,
        },
        {
          sku: "SHORTS-RED-L",
          colour: "Red",
          size: "L",
          quantity: 3,
        },
        {
          sku: "SHORTS-BLUE-S",
          colour: "Blue",
          size: "S",
          quantity: 10,
        },
        {
          sku: "SHORTS-BLUE-M",
          colour: "Blue",
          size: "M",
          quantity: 5,
        },
        {
          sku: "SHORTS-BLUE-L",
          colour: "Blue",
          size: "L",
          quantity: 3,
        },
        {
          sku: "SHORTS-GREEN-S",
          colour: "Green",
          size: "S",
          quantity: 10,
        },
        {
          sku: "SHORTS-GREEN-M",
          colour: "Green",
          size: "M",
          quantity: 5,
        },
        {
          sku: "SHORTS-GREEN-L",
          colour: "Green",
          size: "L",
          quantity: 3,
        },
      ],
    },

    {
      id: "COAT",
      product_name: "Coat",
      icon: {
        url: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/16cf45a09e7baaeb5bca72bfe569fe5d3ff03c83/assets/Coat/Color/coat_color.svg",
        colour: "#f0c592",
      },
      variants: [
        {
          sku: "COAT-ORANGE-S",
          colour: "Orange",
          size: "S",
          quantity: 10,
        },
        {
          sku: "COAT-ORANGE-M",
          colour: "Orange",
          size: "M",
          quantity: 5,
        },
        {
          sku: "COAT-ORANGE-L",
          colour: "Orange",
          size: "L",
          quantity: 3,
        },
        {
          sku: "COAT-BLUE-S",
          colour: "Blue",
          size: "S",
          quantity: 10,
        },
        {
          sku: "COAT-BLUE-M",
          colour: "Blue",
          size: "M",
          quantity: 5,
        },
        {
          sku: "COAT-BLUE-L",
          colour: "Blue",
          size: "L",
          quantity: 3,
        },
      ],
    },
  ]);
};
