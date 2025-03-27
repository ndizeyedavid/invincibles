import { Request, Response } from "express";
import * as ProperyServices from "../services/PropertyServices";
import * as AmenityServices from "../services/AmenityServices";
import { generateId } from "../utils/generateId";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import respond from "../utils/response";
export const create = async (req: Request, res: Response) => {
  try {
    const propertyAmenity_id = generateId();
    const { property_id, amenity_id } = req.body;
    const property = await ProperyServices.findById(property_id);
    if (!property)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not exist.");
    const aminity = await AmenityServices.findAmintyById(amenity_id);
    if (!aminity)
      throw new ApiError(httpStatus.NOT_FOUND, "Aminity does not exist");
    await AmenityServices.create({
      ...req.body,
      propertyAmenity_id,
    });
    const amenity = await AmenityServices.findById(propertyAmenity_id);
    if (!amenity)
      throw new ApiError(httpStatus.NOT_FOUND, "Something went wrong");
    respond(res, true, "Property amenity is created successfully", amenity);
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
    const { amenity_id } = req.params;
    const amenity = await AmenityServices.findById(amenity_id);
    if (!amenity)
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Property Aminity does not exist."
      );
    let icon = null;
    if (req.file !== undefined) {
      icon = `./public/files/${req.file.filename}`;
    }
    await AmenityServices.update({
      ...req.body,
      propertyAmenity_id: amenity_id,
      icon,
    });
    const updatedAmenity = await AmenityServices.findById(amenity_id);
    respond(
      res,
      true,
      "Property amenti is update successfully",
      updatedAmenity
    );
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
    const { property_id } = req.params;
    const property = await ProperyServices.findById(property_id);
    if (!property)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not exist");
    const amunityies = await AmenityServices.findByPropertyId(property_id);
    if (!amunityies)
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Property Aminities does not exist."
      );
    respond(res, true, "Property aminities found successfully!", amunityies);
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
    const { amenity_id } = req.params;
    const amenity = await AmenityServices.findById(amenity_id);
    if (!amenity)
      throw new ApiError(httpStatus.NOT_FOUND, "Amenity does not exist.");
    respond(res, true, "Amenity found successfully", amenity);
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
    const { amenity_id } = req.params;
    const amenity = await AmenityServices.findById(amenity_id);
    if (!amenity)
      throw new ApiError(httpStatus.NOT_FOUND, "Amenity does not exist.");
    await AmenityServices.deleteById(amenity_id);
    return respond(res, true, "Amenity Deleted successfully!");
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
