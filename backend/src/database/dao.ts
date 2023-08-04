import { db } from "./database";
import { CreateMessage, insertMessageSchema, messages } from "./schema";

export const createMessage = (draftMessage: CreateMessage) => {
  const rows = insertMessageSchema.parse(draftMessage);
  const success = db.insert(messages).values(rows).returning().get();
  return success;
};
