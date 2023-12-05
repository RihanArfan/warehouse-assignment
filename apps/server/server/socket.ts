import { Response } from "./types.ts";

/**
 * Send message to client
 */
export async function send(conn: Deno.Conn, payload: Response<any>) {
  await conn.write(new TextEncoder().encode(JSON.stringify(payload)));
}
