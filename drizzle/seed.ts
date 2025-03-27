import dotenv from "dotenv";
import { Table, getTableName, sql } from "drizzle-orm";
import { poolConnection, db, DbType } from "../src/config/dbConnection";
import * as schema from "./schema";
import * as seeds from "./seeds";

dotenv.config();

if (!process.env.DB_SEEDING) {
  throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

async function resetTable(db: DbType, table: Table) {
  const tableName = getTableName(table);

  // Disable foreign key checks
  await db.execute(sql.raw(`SET FOREIGN_KEY_CHECKS = 0`));

  // Delete all rows and reset auto-increment
  await db.execute(sql.raw(`DELETE FROM ${tableName}`));
  await db.execute(sql.raw(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1`));

  // Re-enable foreign key checks
  await db.execute(sql.raw(`SET FOREIGN_KEY_CHECKS = 1`));
}

(async () => {
  try {
    // Reset tables in reverse dependency order
    for (const table of [schema.amenityTable, schema.aminityCategoryTable]) {
      await resetTable(db, table);
    }
    // Seed the tables in the correct dependency order
    await seeds.aminityCategory(db);
    await seeds.eminty(db);
    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    // Close the database connection
    await poolConnection.end();
  }
})();
