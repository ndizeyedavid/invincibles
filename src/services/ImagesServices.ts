import { and, eq, ne } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { CreateImage, UpdateImage } from "../types/image";
import { propertyImagesTable } from "../../drizzle/schema";

export const create = async (data: CreateImage) => {
  try {
    return await db.insert(propertyImagesTable).values(data);
  } catch (error) {
    throw error;
  }
};

export const update = async (data: UpdateImage) => {
  try {
    return await db
      .update(propertyImagesTable)
      .set(data)
      .where(eq(propertyImagesTable.image_id, data.image_id));
  } catch (error) {
    throw error;
  }
};

export const findMany = async (property_Id: string) => {
  try {
    return await db.query.propertyImagesTable.findMany({
      where: and(
        ne(propertyImagesTable.status, "DELETED"),
        eq(propertyImagesTable.property_id, property_Id)
      ),
    });
  } catch (error) {
    throw error;
  }
};

export const findById = async (image_id: string) => {
  try {
    return await db.query.propertyImagesTable.findFirst({
      where: and(
        eq(propertyImagesTable.image_id, image_id),
        ne(propertyImagesTable.status, "DELETED")
      ),
    });
  } catch (error) {
    throw error;
  }
};

export const deleteById = async (image_id: string) => {
  try {
    return await db
      .update(propertyImagesTable)
      .set({
        deleted_at: new Date(),
        status: "DELETED",
      })
      .where(eq(propertyImagesTable.image_id, image_id));
  } catch (error) {
    throw error;
  }
};
