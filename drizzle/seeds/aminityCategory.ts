import { DbType } from "../../src/config/dbConnection";
import aminityCategory from "../data/eminityCategory.json";
import { aminityCategoryTable } from "../schema";

export default async function seed(db: DbType) {
  await db.insert(aminityCategoryTable).values(aminityCategory);
}
