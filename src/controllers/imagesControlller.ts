import { Request, Response } from "express";
import * as PropertiesServices from "../services/PropertyServices";
import * as ImagesServices from "../services/ImagesServices";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { generateId } from "../utils/generateId";
import respond from "../utils/response";
import { queryFilter } from "../utils/queryFilter";

export const create = async (req: Request, res: Response) => {
  try {
    const property = await PropertiesServices.findById(req.body.property_id);
    if (!property)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not exist.");
    if (req.files !== undefined) {
      await Promise.all(
        (req.files as Express.Multer.File[]).map(
          (element: Express.Multer.File, index: number) =>
            ImagesServices.create({
              ...req.body,
              image_id: generateId(),
              url: `https://res.cloudinary.com/kist/image/upload/v1711023040/${element.filename}`,
              isPrimary: index == 0 ? true : false,
            })
        )
      );
    }

    const images = await ImagesServices.findMany(property.property_id);
    respond(res, true, "Property image created successfully!", images);
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
    const { image_id } = req.params;
    const image = await ImagesServices.findById(image_id);
    if (!image)
      throw new ApiError(httpStatus.NOT_FOUND, "Image does not exist.");
    const properties = await PropertiesServices.findById(image.property_id);
    if (!properties)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not exist.");
    if (properties.host_id !== req.authData.user_id)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not allowed to update this image."
      );
    if (req.file !== undefined) {
      await ImagesServices.update({
        image_id: image_id,
        url: `https://res.cloudinary.com/kist/image/upload/v1711023040/${req.file.filename}`,
      });
    }
    return respond(res, true, "Image updated successfully!");
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
    const query = queryFilter(req.param);
    const property = PropertiesServices.findById(property_id);
    if (!property)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not exist.");
    const images = await ImagesServices.findMany(property_id);
    if (!images)
      throw new ApiError(httpStatus.NOT_FOUND, "Images does not exist.");
    return respond(res, true, "Images found successfully!", images);
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
    const { image_id } = req.params;
    const image = await ImagesServices.findById(image_id);
    if (!image)
      throw new ApiError(httpStatus.NOT_FOUND, "Image does not exist.");
    const properties = await PropertiesServices.findById(image.property_id);
    if (!properties)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not exist.");
    if (properties.host_id !== req.authData.user_id)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not allowed to Delete this image."
      );
    await ImagesServices.deleteById(image_id);
    respond(res, true, "Image deleted successfully!");
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
