import express from "express";
import { requireAuth } from "../middleware/RequireAuth";
import validation from "../middleware/validation";
import conversation from "../validations/conversationValidations";
import { AuthorizedRole } from "../middleware/outhorizedStaffRoles";
import * as AmenityContoroller from "../controllers/ConversationController";

const router = express.Router();

//create amenity
router.post(
  "/",
  requireAuth,
  validation(conversation.create),
  AmenityContoroller.create
);
// get by loggedin user
router.get("/", requireAuth, AmenityContoroller.findMany);
export default router;
