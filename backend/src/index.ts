import { Server } from "socket.io";
import app from "./app";
import http from "http";
import { db } from "./database/database";
import { insertMessageSchema, messages } from "./database/schema";
import { faker } from "@faker-js/faker";

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
    const rows = insertMessageSchema.parse(message);
    const success = db.insert(message).values(rows).run();
    io.to("main").emit("message", message);
  });
});

setInterval(() => {
  const draft = {
    id: new Date().getTime(),
    body: faker.hacker.phrase(),
    userHandle: faker.person.fullName(),
    createdAt: new Date(),
  };
  const rows = insertMessageSchema.parse(draft);
  const success = db.insert(messages).values(rows).run();
  io.to("main").emit("message", draft);
}, 10000);

server.listen(port, () => {
  console.log("Running on port:", port);
});
