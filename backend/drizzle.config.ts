import type { Config } from "drizzle-kit";

export default {
  schema: "./src/database/*",
  out: "./drizzle",
} satisfies Config;
