import express from "express";
import { requireAuth } from "../middleware/RequireAuth";
import validation from "../middleware/validation";
import MessageValidationSchema from "../validations/messagesValidation";
import { AuthorizedRole } from "../middleware/outhorizedStaffRoles";
import * as MessageController from "../controllers/MessageController";
import uploadFile from "../config/multer";

const router = express.Router();

//create amenity
router.post(
  "/",
  requireAuth,
  validation(MessageValidationSchema.create),
  MessageController.create
);

// get message by conversation id
router.get(
  "/:conversation_id",
  requireAuth,
  AuthorizedRole("admin", "hoster"),
  MessageController.findByConversationId
);

export default router;
