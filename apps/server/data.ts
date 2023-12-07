import type { Customer, Supplier } from "./server/types.ts";

const suppliers: Supplier[] = [
  {
    id: "clothes",
    name: "Clothes",
    description: "We offer different  of items of clothing",
    icon: "i-fluent-emoji-t-shirt",

    users: [
      {
        name: "John Doe",
        email: "johndoe@supplier-a.example.com",
        password:
          "c2NyeXB0AA4AAAAIAAAAARVFFMDPQLTetP1RQaCW5cApwh78uL82eyFk9ZHvUH3kQ7e4G+G6PMkchc5767i6FaEzHrbUwWpdZKBWTPmekuHDxVWYQp01YJDl6764ZoEo",
      },
    ],

    products: [
      {
        id: "TSHIRT",
        name: "T-Shirt",
        icon: {
          name: "i-fluent-emoji-t-shirt",
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
        name: "Shorts",
        icon: {
          name: "i-fluent-emoji-shorts",
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
        name: "Coat",
        icon: {
          name: "i-fluent-emoji-coat",
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
    ],
    broadcasts: [
      {
        date: "2023-10-01",
        message:
          "We are offering a 25% discount on orders over 1000 units until next year!",
      },
      {
        date: "2023-10-02",
        message: "We will be closed on the following bank holiday.",
      },
      {
        date: "2023-10-03",
        message: "Thank you all for being satisfied customers.",
      },
    ],

    connections: [],
  },
  {
    id: "kitchen",
    name: "Kitchen Utensils",
    description: "Durable kitchen utensils for busy kitchens",
    icon: "i-fluent-emoji-bowl-with-spoon",

    users: [],
    products: [],
    broadcasts: [],

    connections: [],
  },
  {
    id: "furniture",
    name: "Furniture",
    description: "Flat pack furniture for your home",
    icon: "i-fluent-emoji-chair",

    users: [],
    products: [],
    broadcasts: [],

    connections: [],
  },
  {
    id: "electronics",
    name: "Electronics",
    description: "High quality electronic components",
    icon: "i-fluent-emoji-light-bulb",

    users: [],
    products: [],
    broadcasts: [],

    connections: [],
  },
  {
    id: "toys",
    name: "Toys",
    description: "Toys for all ages",
    icon: "i-fluent-emoji-teddy-bear",

    users: [],
    products: [],
    broadcasts: [],

    connections: [],
  },
];

const customers: Customer[] = [
  {
    id: "company-a",
    name: "Company A",
    users: [
      {
        name: "John Doe",
        email: "johndoe@company-a.example.com",
        password:
          "c2NyeXB0AA4AAAAIAAAAARVFFMDPQLTetP1RQaCW5cApwh78uL82eyFk9ZHvUH3kQ7e4G+G6PMkchc5767i6FaEzHrbUwWpdZKBWTPmekuHDxVWYQp01YJDl6764ZoEo",
      },
    ],
    suppliers: [
      suppliers[0].id,
      suppliers[1].id,
      suppliers[2].id,
      suppliers[3].id,
      suppliers[4].id,
    ],

    subscribedProducts: [],

    connections: [],
  },
];

const unauthenticatedSockets: Deno.Conn[] = [];

export { suppliers, customers, unauthenticatedSockets };
