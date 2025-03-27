import { Request, Response } from "express";
import * as PropertyServices from "../services/PropertyServices";
import * as ImageServices from "../services/ImagesServices";
import * as propertyAmenity from "../services/AmenityServices";
import * as UserServices from "../services/userServices";
import * as AmenityCategory from "../services/aminitycategoriesServices";
import * as BookingServices from "../services/BookingsServices";
import { generateId } from "../utils/generateId";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import respond from "../utils/response";
import { queryFilter } from "../utils/queryFilter";
import userServices from "../services/userServices";
export const create = async (req: Request, res: Response) => {
  try {
    const property_id = generateId();
    await PropertyServices.create({
      ...req.body,
      property_id,
      host_id: req.authData.user_id,
    });
    const propety = await PropertyServices.findById(property_id);
    if (!propety)
      throw new ApiError(httpStatus.NOT_FOUND, "Something went wrong");
    await userServices.updateRole("HOSTER", req.authData.user_id);
    respond(res, true, "Property Create successfully!", propety);
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
    const { property_id } = req.params;
    const property = await PropertyServices.findById(property_id);
    if (!property)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not exist.");
    console.log(req.authData.user_id);
    if (property.host_id !== req.authData.user_id)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not allowed to update this property data."
      );
    await PropertyServices.update({ ...req.body, property_id });
    const updatedProperty = await PropertyServices.findById(property_id);
    respond(res, true, "Property updated sucessfully!", updatedProperty);
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
    const query = queryFilter(req.query);
    const properties = await PropertyServices.findMany(query.skip, query.limit);
    if (!properties)
      throw new ApiError(httpStatus.NOT_FOUND, "There is not Properites");
    const result = await Promise.all(
      properties.map(async (property) => {
        const propertyImages = await ImageServices.findMany(
          property.property_id
        );
        const propertyAmenities = await propertyAmenity.findByPropertyId(
          property.property_id
        );
        return { ...property, propertyImages, propertyAmenities };
      })
    );
    respond(res, true, "Propeties found successfully", result);
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
    const { property_id } = req.params;
    const property = await PropertyServices.findById(property_id);
    if (!property)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not exist.");
    const hoster = await UserServices.findById(property.host_id);
    const propertyImages = await ImageServices.findMany(property_id);
    const pams = await propertyAmenity.findByPropertyId(property_id);
    const propertyAmenities = await Promise.all(
      pams.map(async (am) => {
        const aminity = await AmenityCategory.getAmityByItOwnId(
          am?.amenity_id ?? ""
        );
        return { ...am, aminty: aminity };
      })
    );
    respond(res, true, "Property foudn successfully", {
      ...property,
      hoster,
      propertyImages,
      propertyAmenities,
    });
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getBookingsByHosterId = async (req: Request, res: Response) => {
  try {
    const { hoster_id } = req.params;
    const hoster = await UserServices.findById(hoster_id);
    if (!hoster)
      throw new ApiError(httpStatus.NOT_FOUND, "Hoster does not exist.");
    const properties = await PropertyServices.findByHosterId(hoster_id);
    if (!properties)
      throw new ApiError(httpStatus.NOT_FOUND, "Properties does not exist.");
    const pl = await Promise.all(
      properties.map(async (property) => {
        const bookings = await BookingServices.findManyByProperyId(
          property.property_id
        );
        return await Promise.all(
          bookings.map(async (book) => {
            const property = await PropertyServices.findById(book.property_id);
            const hoster = await userServices.findById(property?.host_id ?? "");
            return { ...book, property, hoster };
          })
        );
      })
    );
    respond(res, true, "Bookings found successfully", pl.flat());
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
    const { property_id } = req.params;
    const property = await PropertyServices.findById(property_id);
    if (!property)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not exist.");
    if (property.host_id !== req.authData.user_id)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not allowed to delete this property."
      );
    await PropertyServices.deleteById(property_id);
    respond(res, true, "Property deleted successfully!");
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
