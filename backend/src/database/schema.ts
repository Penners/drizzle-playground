import { InferModel, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import sanitize from "sanitize-html";

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey(),
  body: text("title").notNull(),
  userHandle: text("user_handle").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
    sql`current_timestamp`
  ),
});

export const insertMessageSchema = createInsertSchema(messages).transform(
  (item) => {
    return {
      ...item,
      body: sanitize(item.body),
    };
  }
);

export type Message = InferModel<typeof messages>;
