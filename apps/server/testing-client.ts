// testing client for the server
import { delay } from "https://deno.land/std@0.208.0/async/delay.ts";

const SOCKET_PORT = 5555;

const PAYLOAD = {
  action: "GET_PRODUCTS",
};

const connection = await Deno.connect({ port: SOCKET_PORT });
console.log(`connected to server - ${connection.rid}`);

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// read response constantly until connection is closed without blocking the main thread
const readResponse = async () => {
  const buf = new Uint8Array(1024);
  const n = await connection.read(buf);
  if (n === null) return;
  const line = decoder.decode(buf.subarray(0, n)).trim();
  console.log(line);
  await readResponse();
};

readResponse();

const authPayload = {
  action: "AUTH",
  payload: {
    username: "johndoe@supplier-a.example.com",
    password: "password",
  },
};

// authenticate
await connection.write(encoder.encode(JSON.stringify(authPayload)));

// deno delay
await delay(1000);

// user payload
await connection.write(encoder.encode(JSON.stringify(PAYLOAD)));
