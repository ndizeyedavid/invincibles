import { and, eq, ne } from "drizzle-orm";
import { propertiesTable } from "../../drizzle/schema";
import { db } from "../config/dbConnection";
import { CreateProperty, UpdateProperty } from "../types/property";

export const create = async (data: CreateProperty) => {
  try {
    return await db.insert(propertiesTable).values(data);
  } catch (error) {
    throw error;
  }
};

export const update = async (data: UpdateProperty) => {
  try {
    return await db
      .update(propertiesTable)
      .set(data)
      .where(eq(propertiesTable.property_id, data.property_id));
  } catch (error) {
    throw error;
  }
};

export const findMany = async (offset: number, limit: number) => {
  try {
    return await db.query.propertiesTable.findMany({
      where: ne(propertiesTable.status, "DELETED"),
      offset,
      limit,
    });
  } catch (error) {
    throw error;
  }
};

export const findById = async (property_id: string) => {
  try {
    return await db.query.propertiesTable.findFirst({
      where: and(
        eq(propertiesTable.property_id, property_id),
        ne(propertiesTable.status, "DELETED")
      ),
    });
  } catch (error) {
    throw error;
  }
};

export const findByHosterId = async (hoster_id: string) => {
  try {
    return await db.query.propertiesTable.findMany({
      where: and(
        eq(propertiesTable.host_id, hoster_id),
        ne(propertiesTable.status, "DELETED")
      ),
    });
  } catch (error) {
    throw error;
  }
};
export const deleteById = async (property_id: string) => {
  try {
    return await db
      .update(propertiesTable)
      .set({
        deleted_at: new Date(),
        status: "DELETED",
      })
      .where(eq(propertiesTable.property_id, property_id));
  } catch (error) {
    throw error;
  }
};
