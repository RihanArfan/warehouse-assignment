import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        blue: {
          "50": "#f0f7ff",
          "100": "#e1effe",
          "200": "#b9dcfe",
          "300": "#7cc3fd",
          "400": "#0c89e9",
          "500": "#0067c2",
          "600": "#0154a2",
          "700": "#064784",
          "800": "#0b3f6f",
          "950": "#07284b",
        },
      },
    },
  },
};
