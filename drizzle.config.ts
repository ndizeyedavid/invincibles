import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();
const dbUrl = process.env.DATABASE_URL as string;

export default defineConfig({
  schema: './drizzle/schema/index.ts',
  out: './drizzle/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  strict: true,
});
