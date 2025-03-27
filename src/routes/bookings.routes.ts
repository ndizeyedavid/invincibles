import express from "express";
import { requireAuth } from "../middleware/RequireAuth";
import validation from "../middleware/validation";
import BookingImagesValidationSchema from "../validations/bookingsValidations";
import { AuthorizedRole } from "../middleware/outhorizedStaffRoles";
import * as BookingsContoroller from "../controllers/bookingsController";

const router = express.Router();

// create booking
router.post(
  "/",
  requireAuth,
  validation(BookingImagesValidationSchema.create),
  BookingsContoroller.create
);
//update propety
router.patch(
  "/:booking_id",
  requireAuth,
  validation(BookingImagesValidationSchema.update),
  BookingsContoroller.update
);
// get bookings by loggedin renter
router.get("/", requireAuth, BookingsContoroller.findByRenterId);
// get bookings by propery
router.get(
  "/:property_id",
  requireAuth,
  AuthorizedRole("admin", "hoster"),
  BookingsContoroller.findByProperty
);
// console applicaiton
router.post("/:booking_id", requireAuth, BookingsContoroller.consoleBooking);
router.put("/:booking_id", requireAuth, BookingsContoroller.approveBooking);

// delete
// router.delete("/:booking_id", requireAuth, BookingsContoroller.deleteById);

export default router;
