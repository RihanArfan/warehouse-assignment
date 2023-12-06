import {
  authenticate,
  storeConnection,
  unstoreConnection,
} from "../server/authentication.ts";
import * as payloads from "../server/payloads.ts";
import type { Payload, Response } from "../server/types.ts";

export class BaseHandler {
  protected id: string = "";
  protected type: "supplier" | "customer";

  constructor(protected connection: Deno.Conn, type: "supplier" | "customer") {
    this.type = type;
    console.log(`[${type}] client connected (${connection.rid})`);
  }

  disconnect() {
    console.debug(
      `[${this.type}] disconnected (socket ${this.connection.rid})`
    );
    unstoreConnection(this.id, this.connection, "supplier");

    try {
      this.connection?.close();
    } catch (error) {
      // ignore
    }
  }

  async readLine(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const buf = new Uint8Array(1024);
        const n = await this.connection.read(buf);
        if (n === null) return resolve("");
        resolve(new TextDecoder().decode(buf.subarray(0, n)).trim());
      } catch (e) {
        this.disconnect();
        reject("client disconnected");
      }
    });
  }

  async send(response: Response) {
    const textEncoder = new TextEncoder();
    const string = JSON.stringify(response);
    await this.connection.write(textEncoder.encode(string));
  }

  async parsePayload(line: string): Promise<Payload<unknown>> {
    return new Promise((resolve, reject) => {
      try {
        const payload = JSON.parse(line) as Payload<unknown>;
        if (!payload.action) throw new Error("no action was provided");
        resolve(payload);
      } catch (error) {
        this.send({
          code: "INVALID_DATA",
          message: "invalid json was sent",
        });
        reject(error);
      }
    });
  }

  async authenticate() {
    while (true) {
      // read line from connection
      const line = await this.readLine().catch((error) => {
        if (error === "client disconnected") return "client disconnected";
        throw error;
      });
      if (!line) continue; // empty line
      if (line === "client disconnected") return; // connection closed

      // parse payload
      const rq = await this.parsePayload(line).catch((error) => undefined);
      if (!rq) continue;

      // prevent unauthenticated from accessing other commands
      if (rq.action !== "AUTH") {
        await this.send({
          code: "UNAUTHENTICATED",
          message: "authenticate first",
        });
        continue;
      }

      // validation
      const { data, problems } = payloads.auth(rq.payload);
      if (problems?.length || !data) {
        await this.send({
          code: "AUTH_FAILED",
          message: "invalid payload",
          errors: problems,
        });
        continue;
      }

      // authentication
      const { username, password } = data;
      const item = authenticate(username, password, this.type);
      if (!item) {
        await this.send({
          code: "AUTH_FAILED",
          message: "invalid credentials",
        });
        continue;
      }

      this.id = item.id;
      storeConnection(this.id, this.connection, this.type);
      await this.send({ code: "AUTH_SUCCESS" });

      return;
    }
  }
}
