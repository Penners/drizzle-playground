import { Server } from "socket.io";
import app from "./app";
import http from "http";
import { faker } from "@faker-js/faker";
import { createMessage } from "./database/dao";

const port = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("join", (data) => {
    console.log("Join event", data);
    socket.join("main");
  });

  socket.on("message:send", (message) => {
    const success = createMessage(message);
    io.to("main").emit("message", success);
  });
});

setInterval(() => {
  const draft = {
    body: faker.hacker.phrase(),
    userHandle: faker.person.fullName(),
    createdAt: new Date(),
  };
  const success = createMessage(draft);
  io.to("main").emit("message", success);
}, 10000);

server.listen(port, () => {
  console.log("Running on port:", port);
});
