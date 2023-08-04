import express from "express";
import { db } from "./database/database";
import { Message, insertMessageSchema, messages } from "./database/schema";
import { asc, desc, eq, sql } from "drizzle-orm";
import { errorHandler, notFound } from "./middleware";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use(notFound);
app.use(errorHandler);

export default app;
