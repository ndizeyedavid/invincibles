import { DbType } from "../../src/config/dbConnection";
import aminity from "../data/amenity.json";
import { amenityTable } from "../schema";

export default async function seed(db: DbType) {
  await db.insert(amenityTable).values(aminity);
}
