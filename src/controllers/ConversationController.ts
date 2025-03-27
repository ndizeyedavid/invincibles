import { Request, response, Response } from "express";
import * as UserServices from "../services/userServices";
import * as PropertyServices from "../services/PropertyServices";
import * as ConversationServices from "../services/ConversationServices";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { generateId } from "../utils/generateId";
import respond from "../utils/response";
import { userInfo } from "os";
import { queryFilter } from "../utils/queryFilter";

export const create = async (req: Request, res: Response) => {
  try {
    const propety = await PropertyServices.findById(req.body.property_id);
    if (!propety)
      throw new ApiError(httpStatus.NOT_FOUND, "Propety does not exist.");
    const hoster = await UserServices.findById(propety.host_id);
    if (!hoster)
      throw new ApiError(httpStatus.NOT_FOUND, "Hoster does not exist");
    const renter_id = req.authData.user_id;
    const conv = await ConversationServices.findbyHosterRenterAndPropertyId(
      propety.host_id,
      req.authData.user_id,
      propety.property_id
    );
    if (conv)
      return respond(
        res,
        false,
        "Conversations alredy exist. on property between the users.",
        conv
      );
    const conversation_id = generateId();
    await ConversationServices.create({
      ...req.body,
      conversation_id,
      host_id: propety.host_id,
      renter_id,
    });
    const conversation = await ConversationServices.findById(conversation_id);
    return respond(
      res,
      true,
      "Conversation created successfully!",
      conversation
    );
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// export const update = async (req: Request, res: Response) => {
//   try {
//   } catch (error: any) {
//     console.error("Error forget password:", error);
//     return res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };
export const findMany = async (req: Request, res: Response) => {
  try {
    const query = queryFilter(req.query);
    const user_id = req.authData.user_id;
    const conversations = await ConversationServices.findByLoggedinuser(
      user_id,
      query.skip,
      query.limit
    );
    if (!conversations)
      throw new ApiError(httpStatus.NOT_FOUND, "Conversation does not exist.");
    respond(res, true, "Conversation found successfully.", conversations);
  } catch (error: any) {
    console.error("Error:", error);
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
// export const deleteById = async (req: Request, res: Response) => {
//   try {
//   } catch (error: any) {
//     console.error("Error forget password:", error);
//     return res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };
