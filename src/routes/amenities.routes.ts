import express from "express";
import { requireAuth } from "../middleware/RequireAuth";
import validation from "../middleware/validation";
import PropertyAmenityValidationSchema from "../validations/amenityValidation";
import { AuthorizedRole } from "../middleware/outhorizedStaffRoles";
import * as AmenityContoroller from "../controllers/AmenityController";
import uploadFile from "../config/multer";

const router = express.Router();

//create amenity
router.post(
  "/",
  requireAuth,
  AuthorizedRole("hoster", "admin"),
  uploadFile.single("icon"),
  validation(PropertyAmenityValidationSchema.create),
  AmenityContoroller.create
);
//update amenity
router.patch(
  "/:amenity_id",
  requireAuth,
  AuthorizedRole("hoster", "admin"),
  uploadFile.single("icon"),
  validation(PropertyAmenityValidationSchema.update),
  AmenityContoroller.update
);

// get all
router.get(
  "/:property_id",
  requireAuth,
  AuthorizedRole("admin", "hoster"),
  AmenityContoroller.findMany
);

// get single
router.get("/am/:amenity_id", requireAuth, AmenityContoroller.findById);

// delete
router.delete("/:amenity_id", requireAuth, AmenityContoroller.deleteById);

export default router;
