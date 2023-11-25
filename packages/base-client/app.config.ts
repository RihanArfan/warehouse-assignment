export default defineAppConfig({
  ui: {
    primary: "blue",
    gray: "zinc",
    input: {
      rounded: "rounded",
      color: {
        white: {
          outline:
            "shadow-sm bg-[#fbfbfb] hover:bg-[#f6f6f6] focus:bg-white text-gray-900 ring-0 focus:ring-0 border border-b border-[#e5e5e5] focus:border-[#e5e5e5] border-b-[#868686] focus:border-b-primary-500 focus:border-b-2 mb-[1.5px] focus:mb-0",
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
      gap: {
        sm: "gap-x-2",
        md: "gap-x-3",
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
