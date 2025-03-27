import { application, Request, Response } from "express";
import * as PropertyServices from "../services/PropertyServices";
import * as BookingServices from "../services/BookingsServices";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { generateId } from "../utils/generateId";
import respond from "../utils/response";
import { date } from "joi";
import { queryFilter } from "../utils/queryFilter";
import userServices from "../services/userServices";

export const create = async (req: Request, res: Response) => {
  try {
    const query = queryFilter(req.query);
    const propety = await PropertyServices.findById(req.body.property_id);
    if (!propety)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not exist.");
    if (propety.maxGuests < req.body.guestCount)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        `Property can only accomodate ${propety.maxGuests} Guests.`
      );
    // if you book property you are not allowed to bok it again
    const alreadyBooked = await BookingServices.findByPropertyByIdAndRenterId(
      propety.property_id,
      req.authData.user_id
    );
    if (alreadyBooked.length > 0)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You alredy booked this property"
      );
    // check in date must be greater or equal to day
    if (new Date(req.body.checkIn) < new Date())
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Check in date must be future date"
      );
    // check out date must be greater than check in day
    if (new Date(req.body.checkIn) >= new Date(req.body.checkOut))
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Check out date must be greater than check in date"
      ); // check if there is no property bookind status eqal to approved
    const approvedBookings = await BookingServices.findApprovedBookings(
      propety.property_id,
      req.body.checkIn,
      req.body.checkOut
    );
    if (approvedBookings.length > 0)
      throw new ApiError(httpStatus.UNAUTHORIZED, "These dates are token");
    // on approval other intersecting booking should be canselde
    const booking = await BookingServices.findByPropertyId(
      propety.property_id,
      query.skip,
      query.limit
    );
    const booking_id = generateId();
    const totalDay =
      (new Date(req.body.checkOut).getTime() -
        new Date(req.body.checkIn).getTime()) /
      (1000 * 60 * 60 * 24);

    await BookingServices.create({
      ...req.body,
      renter_id: req.authData.user_id,
      booking_id,
      totalPrice: totalDay * propety.pricePerNight,
    });
    const bookingRequest = await BookingServices.findById(booking_id);
    return respond(
      res,
      true,
      "Booking request sent successfully.",
      bookingRequest
    );
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { booking_id } = req.params;
    const user_id = req.authData.user_id;
    const booking = await BookingServices.findById(booking_id);
    if (!booking)
      throw new ApiError(httpStatus.NOT_FOUND, "Booking does not exist.");
    if (
      booking.booking_status == "APPROVED" ||
      booking.booking_status == "CONCERED" ||
      booking.renter_id !== user_id
    )
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "You are not allowed to update this booking Request."
      );
    const propety = await PropertyServices.findById(booking.property_id);
    if (!propety)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not exist.");
    if (propety.maxGuests < req.body.guestCount)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        `Property can only accomodate ${propety.maxGuests} Guests.`
      );
    // check in date must be greater or equal to day
    if (new Date(req.body.checkIn) < new Date())
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Check in date must be future date"
      );
    // check out date must be greater than check in day
    if (new Date(req.body.checkIn) >= new Date(req.body.checkOut))
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Check out date must be greater than check in date"
      ); // check if there is no property bookind status eqal to approved
    const approvedBookings = await BookingServices.findApprovedBookings(
      propety.property_id,
      req.body.checkIn,
      req.body.checkOut
    );
    if (approvedBookings.length > 0)
      throw new ApiError(httpStatus.UNAUTHORIZED, "These dates are token");
    // on approval other intersecting booking should be canselde
    const totalDay =
      (new Date(req.body.checkOut).getTime() -
        new Date(req.body.checkIn).getTime()) /
      (1000 * 60 * 60 * 24);

    await BookingServices.update({
      ...req.body,
      renter_id: req.authData.user_id,
      booking_id,
      totalPrice: totalDay * propety.pricePerNight,
    });
    const bookingRequest = await BookingServices.findById(booking_id);
    return respond(
      res,
      true,
      "Booking request updated successfully.",
      bookingRequest
    );
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const findByRenterId = async (req: Request, res: Response) => {
  try {
    const query = queryFilter(req.query);
    const user_Id = req.authData.user_id;

    const requests = await BookingServices.findByRenter(
      user_Id,
      query.skip,
      query.limit
    );
    const history = await Promise.all(
      requests.map(async (request) => {
        const property = await PropertyServices.findById(request.property_id);
        const hoster = await userServices.findById(property?.host_id ?? "");
        return { ...request, property, hoster };
      })
    );
    return respond(res, true, "Bookings requests found sucessfully.", history);
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const findByProperty = async (req: Request, res: Response) => {
  try {
    const query = queryFilter(req.query);
    const { property_id } = req.params;
    const user_Id = req.authData.user_id;
    const property = await PropertyServices.findById(property_id);
    if (property?.host_id !== user_Id)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not allowed to access booking request for this property"
      );
    if (!property)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not exist.");
    const request = await BookingServices.findByPropertyId(
      property.property_id,
      query.skip,
      query.limit
    );
    return respond(res, true, "Bookings requests found sucessfully.", request);
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
export const consoleBooking = async (req: Request, res: Response) => {
  try {
    const { booking_id } = req.params;
    const user_id = req.authData.user_id;
    const bookingRequest = await BookingServices.findById(booking_id);
    if (!bookingRequest)
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Booking request does not exist."
      );
    const propety = await PropertyServices.findById(bookingRequest.property_id);
    if (!propety)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not eixt.");
    if (bookingRequest.renter_id !== user_id || propety.host_id !== user_id)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not allowed to Console this application"
      );
    await BookingServices.consoleApplication(booking_id);
    const newbookingRequest = await BookingServices.findById(booking_id);

    return respond(
      res,
      true,
      "Appliction canceled successfully",
      newbookingRequest
    );
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const approveBooking = async (req: Request, res: Response) => {
  try {
    const { booking_id } = req.params;
    const user_id = req.authData.user_id;
    const bookingRequest = await BookingServices.findById(booking_id);
    if (!bookingRequest)
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Booking request does not exist."
      );
    if (bookingRequest.booking_status === "CONCERED")
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Request is conseled, you are not allowed to approve it."
      );
    const propety = await PropertyServices.findById(bookingRequest.property_id);
    if (!propety)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not eixt.");
    if (propety.host_id !== user_id)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not allowed to approve this application"
      );

    const sameRangeRequests = await BookingServices.findApprovedBookings(
      propety.property_id,
      bookingRequest.checkIn,
      bookingRequest.checkOut
    );
    if (sameRangeRequests.length > 0) {
      await Promise.all(
        sameRangeRequests.map(async (bookrequest) => {
          await BookingServices.consoleApplication(bookrequest.booking_id);
        })
      );
    }
    await BookingServices.approveApplication(booking_id);
    const newbookingRequest = await BookingServices.findById(booking_id);

    return respond(
      res,
      true,
      "Appliction approved successfully",
      newbookingRequest
    );
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
