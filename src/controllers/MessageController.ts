import { Request, Response } from "express";
import * as MessageServices from "../services/MessageServices";
import * as ConversationServices from "../services/ConversationServices";
import { generateId } from "../utils/generateId";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import respond from "../utils/response";
export const create = async (req: Request, res: Response) => {
  try {
    const senderId = req.authData.user_id;
    const conversation = await ConversationServices.findById(
      req.body.conversation_id
    );
    if (!conversation)
      throw new ApiError(httpStatus.NOT_FOUND, "Conversation does not exist.");
    const message_id = generateId();
    await MessageServices.create({
      ...req.body,
      senderId,
      message_id,
    });
    const message = await MessageServices.findById(message_id);
    if (!message)
      throw new ApiError(httpStatus.NOT_FOUND, "Message does not exist.");
    respond(res, true, "Message Sent successfully!", message);
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
// export const findMany = async (req: Request, res: Response) => {
//   try {
//   } catch (error: any) {
//     console.error("Error forget password:", error);
//     return res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };
export const findByConversationId = async (req: Request, res: Response) => {
  try {
    const { conversation_id } = req.params;
    const conversation = await ConversationServices.findById(conversation_id);
    if (!conversation)
      throw new ApiError(httpStatus.NOT_FOUND, "Conversation does not exist.");
    const messages = await MessageServices.findMessagesByConversationId(
      conversation_id
    );
    if (!messages)
      throw new ApiError(httpStatus.NOT_FOUND, "Message does not exist.");
    return respond(res, true, "Message found successfully.", messages);
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
