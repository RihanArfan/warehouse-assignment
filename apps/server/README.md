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

## Testing

```bash
deno test
```

## Documentation

Documentation for the system

### Creating users

Add a record to customers/suppliers' user array. Password should be hashed with scrypt.

**Hashing password:**

```bash
deno run https://deno.land/x/scrypt@v4.2.1/cli.ts hash <password>
```

### Testing client

You can use `testing-client.ts` to authenticate and manually send payloads to the server.

Update the socket and payload at the top of the file, then execute it.

```bash
deno run --allow-net testing-client.ts
```
