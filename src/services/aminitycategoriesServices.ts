import { eq } from "drizzle-orm";
import { amenityTable, aminityCategoryTable } from "../../drizzle/schema";
import { db } from "../config/dbConnection";

export const getCategories = async () => {
  try {
    return await db.select().from(aminityCategoryTable);
  } catch (error) {
    throw error;
  }
};

export const getAmityByCategoryId = async (categoryId: string) => {
  try {
    return await db.query.amenityTable.findMany({
      where: eq(amenityTable.amenityCode, categoryId),
    });
  } catch (error) {
    throw error;
  }
};

export const getAmityByItOwnId = async (aminity_id: string) => {
  try {
    return await db.query.amenityTable.findFirst({
      where: eq(amenityTable.id, aminity_id),
    });
  } catch (error) {
    throw error;
  }
};
