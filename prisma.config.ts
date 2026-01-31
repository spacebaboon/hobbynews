import dotenv from "dotenv";
import path from "node:path";
import { defineConfig } from "prisma/config";

dotenv.config({ path: ".env.local" });
dotenv.config();

export default defineConfig({
  schema: path.join(__dirname, "prisma/schema.prisma"),
  migrations: {
    path: path.join(__dirname, "prisma/migrations"),
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"]!,
  },
});
