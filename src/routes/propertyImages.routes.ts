import express from "express";
import { requireAuth } from "../middleware/RequireAuth";
import validation from "../middleware/validation";
import PropertyImagesValidationSchema from "../validations/propertyImages";
import { AuthorizedRole } from "../middleware/outhorizedStaffRoles";
import * as PropertyImageContoroller from "../controllers/imagesControlller";
import uploadFile from "../config/multer";

const router = express.Router();

//create propety image
router.post(
  "/",
  requireAuth,
  AuthorizedRole("admin", "hoster"),
  uploadFile.array("image"),
  validation(PropertyImagesValidationSchema.create),
  PropertyImageContoroller.create
);
//update propety image
router.patch(
  "/:image_id",
  requireAuth,
  uploadFile.single("image"),
  PropertyImageContoroller.update
);

// get all
router.get("/:property_id", requireAuth, PropertyImageContoroller.findMany);

// get single
// router.get("/:propty_id", requireAuth, PropertyImageContoroller.findById);

// delete
router.delete(
  "/:image_id",
  requireAuth,
  AuthorizedRole("admin", "hoster"),
  PropertyImageContoroller.deleteById
);

export default router;
