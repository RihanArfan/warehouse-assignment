# server

Warehouse server built with Deno.

## Stack

- [Deno](https://deno.com)
- [Arktype](https://arktype.io/)

## Running

**Development:**

```bash
pnpm run dev
```

**Production:**

```bash
pnpm run compile
./server.exe
```

## Documentation

Documentation for the system

### Creating users

Add a record to customers/suppliers' user array. Password should be hashed with scrypt.

**Hashing password:**

```bash
deno run https://deno.land/x/scrypt@v4.2.1/cli.ts hash <password>
```
