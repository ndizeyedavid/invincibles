import * as mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '../../drizzle/schema';

dotenv.config();

const poolConnection = mysql.createPool({
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  host: process.env.HOST,
  user: process.env.USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  multipleStatements: false,
  connectionLimit: 100,
  queueLimit: 100,
});
const pool = poolConnection;
// Define and export the db type
type DbType = MySql2Database<typeof schema>;

const db: DbType = drizzle(poolConnection, {
  schema: schema,
  mode: 'default',
  logger: true,
});

export { db, poolConnection, pool, DbType };
