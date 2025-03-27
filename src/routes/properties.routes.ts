import express from "express";
import { requireAuth } from "../middleware/RequireAuth";
import validation from "../middleware/validation";
import PropertyValidationSchema from "../validations/propertyValidation";
import { AuthorizedRole } from "../middleware/outhorizedStaffRoles";
import * as PropertyContoroller from "../controllers/propertyControllet";

const router = express.Router();

//create propety
router.post(
  "/",
  requireAuth,
  validation(PropertyValidationSchema.create),
  PropertyContoroller.create
);
//update propety
router.patch(
  "/:property_id",
  requireAuth,
  validation(PropertyValidationSchema.update),
  PropertyContoroller.update
);

// get all
router.get("/", PropertyContoroller.findMany);

// get single
router.get("/:property_id", PropertyContoroller.findById);
router.get("/host/:hoster_id", PropertyContoroller.getBookingsByHosterId);

// delete
router.delete(
  "/:property_id",
  requireAuth,
  AuthorizedRole("admin", "hoster"),
  PropertyContoroller.deleteById
);

export default router;
