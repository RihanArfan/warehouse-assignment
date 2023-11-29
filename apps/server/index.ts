import * as zmq from "npm:zeromq@6.0.0-beta.19";

console.log("testing");

const sock = new zmq.Reply();

await sock.bind("tcp://127.0.0.1:9000");

for await (const [msg] of sock) {
  await sock.send(2 * parseInt(msg, 10));
}
