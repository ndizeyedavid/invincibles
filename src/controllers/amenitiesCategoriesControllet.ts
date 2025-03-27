import { Request, Response } from "express";
import * as AmintyCategoryServices from "../services/aminitycategoriesServices";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import respond from "../utils/response";
export const getAmenitiesCategories = async (req: Request, res: Response) => {
  try {
    const response = await AmintyCategoryServices.getCategories();
    if (!response)
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Amenity categories does not exist."
      );
    const aminityCategories = await Promise.all(
      response.map(async (category) => {
        const aminity = await AmintyCategoryServices.getAmityByCategoryId(
          category.id
        );
        return { ...category, aminity };
      })
    );
    return respond(
      res,
      true,
      "Amenities categories found successfully!.",
      aminityCategories
    );
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
