import cron from "node-cron";
import { and, eq, lt } from "drizzle-orm";
import moment from "moment";
import { db } from "../config/dbConnection";
import { bookingsTable } from "../../drizzle/schema";

async function updateExpiredBookings() {
  try {
    const today = moment().startOf("day").toDate();
    const result = await db
      .update(bookingsTable)
      .set({
        status: "INACTIVE",
        updatedAt: new Date(),
      })
      .where(
        and(
          lt(bookingsTable.checkOut, today),
          eq(bookingsTable.status, "ACTIVE")
        )
      );

    console.log("Successfully updated expired bookings to inactive status");
  } catch (error) {
    console.error("Error updating expired bookings:", error);
  }
}

export function initCheckoutCron() {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running checkout status update cron job");
    await updateExpiredBookings();
  });

  updateExpiredBookings();
}
