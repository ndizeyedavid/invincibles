import { eq, ne } from "drizzle-orm";
import { propertiesTable, reviewsTable } from "../../drizzle/schema";
import { db } from "../config/dbConnection";
import { CreateReview, UpdateReview } from "../types/review";

export const create = async (data: CreateReview) => {
  try {
    return await db.insert(reviewsTable).values(data);
  } catch (error) {
    throw error;
  }
};

export const update = async (data: UpdateReview) => {
  try {
    return await db
      .update(reviewsTable)
      .set(data)
      .where(eq(reviewsTable.review_id, data.review_id));
  } catch (error) {
    throw error;
  }
};

export const findByProperyId = async (property_id: string) => {
  try {
    return await db.query.reviewsTable.findMany({
      where: eq(reviewsTable.property_Id, property_id),
    });
  } catch (error) {
    throw error;
  }
};

export const findByBookingId = async (booking_id: string) => {
  try {
    return await db.query.reviewsTable.findMany({
      where: eq(reviewsTable.booking_id, booking_id),
    });
  } catch (error) {
    throw error;
  }
};
