export default defineAppConfig({
  ui: {
    primary: "blue",
    gray: "zinc",
    input: {
      color: {
        white: {
          outline:
            "shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700",
        },
      },
    },
    button: {
      font: "font-normal",
      padding: { sm: "px-6" },
      color: {
        white: {
          solid:
            "ring-gray-200 border-b border-gray-300 shadow-none active:border-gray-200/50",
        },
        primary: {
          solid:
            "shadow-none bg-blue-500 hover:bg-blue-500/90 border-b-[1.5px] border-blue-900 active:border-blue-500 text-white",
        },
      },
    },
    modal: {
      width: "sm:max-w-sm",
      ring: "ring-1 ring-[#919191]",
      overlay: {
        background: "bg-gray-600/50",
      },
    },
  },
});
