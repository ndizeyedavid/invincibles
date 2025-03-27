import { Request, Response } from "express";
import * as PropertyServices from "../services/PaymentServices";
import * as BookingServices from "../services/BookingsServices";
import * as ReviewServices from "../services/ReviesServices";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

export const create = async (req: Request, res: Response) => {
  try {
    const { booking_id } = req.body;
    const user_id = req.authData.user_id;
    const booking = await BookingServices.findById(booking_id);
    if (!booking)
      throw new ApiError(httpStatus.NOT_FOUND, "Booking does not exist.");
    const property = await PropertyServices.findById(booking.property_id);
    if (!property)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not exist.");
    await ReviewServices.create({ ...req.body, user_id });
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
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
export const findMany = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
export const findById = async (req: Request, res: Response) => {
  try {
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
