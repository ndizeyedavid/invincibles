import { and, eq, gte, lte, ne, or } from "drizzle-orm";
import { bookingsTable, propertiesTable } from "../../drizzle/schema";
import { db } from "../config/dbConnection";
import { CreateBooking, UpdateBooking } from "../types/booking";
import { userInfo } from "os";

export const create = async (data: CreateBooking) => {
  try {
    return await db.insert(bookingsTable).values(data);
  } catch (error) {
    throw error;
  }
};

export const update = async (data: UpdateBooking) => {
  try {
    console.log(data);
    return await db
      .update(bookingsTable)
      .set({ ...data })
      .where(eq(bookingsTable.booking_id, data.booking_id));
  } catch (error) {
    throw error;
  }
};

export const findMany = async (offset: number, limit: number) => {
  try {
    return await db.query.bookingsTable.findMany({
      where: ne(bookingsTable.status, "DELETED"),
      offset,
      limit,
    });
  } catch (error) {
    throw error;
  }
};

export const findManyByProperyId = async (property_id: string) => {
  try {
    return await db.query.bookingsTable.findMany({
      where: and(
        ne(bookingsTable.status, "DELETED"),
        eq(bookingsTable.property_id, property_id)
      ),
    });
  } catch (error) {
    throw error;
  }
};
export const findById = async (booking_id: string) => {
  try {
    return await db.query.bookingsTable.findFirst({
      where: and(
        eq(bookingsTable.booking_id, booking_id),
        ne(bookingsTable.status, "DELETED")
      ),
    });
  } catch (error) {
    throw error;
  }
};

export const findByPropertyId = async (
  propety_id: string,
  offset: number,
  limit: number
) => {
  try {
    return await db.query.bookingsTable.findMany({
      where: and(
        eq(bookingsTable.property_id, propety_id),
        ne(bookingsTable.status, "DELETED")
      ),
      offset,
      limit,
    });
  } catch (error) {
    throw error;
  }
};

export const consoleApplication = async (booking_id: string) => {
  try {
    return await db
      .update(bookingsTable)
      .set({
        booking_status: "CONCERED",
      })
      .where(eq(bookingsTable.booking_id, booking_id));
  } catch (error) {
    throw error;
  }
};

export const approveApplication = async (booking_id: string) => {
  try {
    return await db
      .update(bookingsTable)
      .set({
        booking_status: "APPROVED",
      })
      .where(eq(bookingsTable.booking_id, booking_id));
  } catch (error) {
    throw error;
  }
};

export const findByRenter = async (
  user_id: string,
  offset: number,
  limit: number
) => {
  try {
    return await db.query.bookingsTable.findMany({
      where: and(
        eq(bookingsTable.renter_id, user_id),
        ne(bookingsTable.status, "DELETED")
      ),
      offset,
      limit,
    });
  } catch (error) {
    throw error;
  }
};

export const findApprovedBookings = async (
  property_id: string,
  checkInDate: Date,
  checkOutDate: Date
) => {
  try {
    return await db.query.bookingsTable.findMany({
      where: or(
        // New check-in date falls between existing booking
        and(
          lte(bookingsTable.checkIn, checkInDate),
          gte(bookingsTable.checkOut, checkInDate),
          eq(bookingsTable.property_id, property_id),
          ne(bookingsTable.booking_status, "APPROVED")
        ),
        // New check-out date falls between existing booking
        and(
          lte(bookingsTable.checkIn, checkOutDate),
          gte(bookingsTable.checkOut, checkOutDate),
          eq(bookingsTable.property_id, property_id),
          ne(bookingsTable.booking_status, "APPROVED")
        ),
        // New booking completely encompasses an existing booking
        and(
          gte(bookingsTable.checkIn, checkInDate),
          lte(bookingsTable.checkOut, checkOutDate),
          eq(bookingsTable.property_id, property_id),
          ne(bookingsTable.booking_status, "APPROVED")
        )
      ),
    });
  } catch (error) {
    throw error;
  }
};

export const findByPropertyByIdAndRenterId = async (
  property_Id: string,
  renter_id: string
) => {
  try {
    return await db.query.bookingsTable.findMany({
      where: and(
        eq(bookingsTable.property_id, property_Id),
        eq(bookingsTable.renter_id, renter_id),
        ne(bookingsTable.booking_status, "CONCERED")
      ),
    });
  } catch (error) {
    throw error;
  }
};
export const deleteById = async (booking_id: string) => {
  try {
    return await db
      .update(bookingsTable)
      .set({
        deleted_at: new Date(),
        status: "DELETED",
      })
      .where(eq(bookingsTable.booking_id, booking_id));
  } catch (error) {
    throw error;
  }
};
