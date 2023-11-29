import * as zmq from "npm:zeromq@6.0.0-beta.19";

console.log("testing");
const sock = new zmq.Request();

// sock.connect("tcp://127.0.0.1:9000");
// console.log("Producer bound to port 9000");

// await sock.send("4");
// const [result] = await sock.receive();

// console.log(result);
