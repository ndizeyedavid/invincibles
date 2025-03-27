import * as AmenityServices from "../services/AmenityServices";
import { and, eq, ne } from "drizzle-orm";
import { amenityTable, propertyAmenitiesTable } from "../../drizzle/schema";
import { db } from "../config/dbConnection";
import { Create } from "../types/amenity";

export const create = async (data: Create) => {
  try {
    return await db.insert(propertyAmenitiesTable).values(data);
  } catch (error) {
    throw error;
  }
};

export const update = async (data: Create) => {
  try {
    return await db
      .update(propertyAmenitiesTable)
      .set(data)
      .where(
        eq(propertyAmenitiesTable.propertyAmenity_id, data.propertyAmenity_id)
      );
  } catch (error) {
    throw error;
  }
};

export const findMay = async (offset: number, limit: number) => {
  try {
    return await db.query.propertyAmenitiesTable.findMany({
      offset,
      limit,
      where: ne(propertyAmenitiesTable.status, "DELETED"),
    });
  } catch (error) {
    throw error;
  }
};

export const findById = async (propertyAmenity_id: string) => {
  try {
    return await db.query.propertyAmenitiesTable.findFirst({
      where: and(
        eq(propertyAmenitiesTable.propertyAmenity_id, propertyAmenity_id),
        ne(propertyAmenitiesTable.status, "DELETED")
      ),
    });
  } catch (error) {
    throw error;
  }
};

export const findAmintyById = async (aminity_id: string) => {
  try {
    return await db.query.amenityTable.findFirst({
      where: eq(amenityTable.id, aminity_id),
    });
  } catch (error) {
    throw error;
  }
};
export const findByPropertyId = async (property_id: string) => {
  try {
    return await db.query.propertyAmenitiesTable.findMany({
      where: and(
        eq(propertyAmenitiesTable.property_id, property_id),
        ne(propertyAmenitiesTable.status, "DELETED")
      ),
    });
  } catch (error) {
    throw error;
  }
};

export const deleteById = async (amenity_id: string) => {
  try {
    return await db
      .update(propertyAmenitiesTable)
      .set({ status: "DELETED" })
      .where(eq(propertyAmenitiesTable.propertyAmenity_id, amenity_id));
  } catch (error) {
    throw error;
  }
};
