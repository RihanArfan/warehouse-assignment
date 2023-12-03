# warehouse-assignment

Platform for suppliers and customers to interact. Built for an assignment.

## Stack

- [Nuxt 3](https://nuxt.com/)
- [Fluent 2](https://fluent2.microsoft.design/) via [Nuxt UI](https://ui.nuxt.com/)
- [Tauri](https://tauri.app/)
- [Deno](https://deno.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Prerequisites

### Dependencies

- [pnpm](https://pnpm.io/installation#using-a-standalone-script)
- [Node.js](https://pnpm.io/cli/env#use) 20.10.0 LTS or newer
  - You can (and probably should) [install Node.js via pnpm](https://pnpm.io/cli/env#commands)
  - `pnpm env use --global lts`
- [Deno](https://docs.deno.com/runtime/manual/getting_started/installation)
- [Rust](https://tauri.app/v1/guides/getting-started/prerequisites)
- [Microsoft Visual Studio C++ Build Tools](https://tauri.app/v1/guides/getting-started/prerequisites)
- Windows 11

### Setup

Install dependencies:

```bash
pnpm install
```

## Development

Run the development script:

- This will start `server`
- This will start Nuxt's development server for `base-client`, `customer` and `supplier`
- This will run Tauri dev for `customer` and `supplier`
  - Two desktop windows will launch upon build completion

```bash
pnpm run dev
```
