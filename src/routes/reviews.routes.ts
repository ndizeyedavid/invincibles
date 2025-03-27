import express from "express";
import { requireAuth } from "../middleware/RequireAuth";
import validation from "../middleware/validation";
import ReviewValidationSchema from "../validations/reviewsValidation";
import { AuthorizedRole } from "../middleware/outhorizedStaffRoles";
import * as ReviewContoroller from "../controllers/reviewsController";
import uploadFile from "../config/multer";

const router = express.Router();

//create amenity
router.post(
  "/",
  requireAuth,
  uploadFile.single("icon"),
  validation(ReviewValidationSchema.create),
  ReviewContoroller.create
);
//update amenity
// router.patch(
//   "/",
//   uploadFile.single("icon"),
//   requireAuth,
//   validation(PropertyAmenityValidationSchema.update),
//   AmenityContoroller.update
// );

// // get all
// router.get(
//   "/",
//   requireAuth,
//   AuthorizedRole("admin", "hoster"),
//   AmenityContoroller.findMany
// );

// // get single
// router.get("/:amenity_id", requireAuth, AmenityContoroller.findById);

// // delete
// router.delete("/:amenity_id", requireAuth, AmenityContoroller.deleteById);

// delete all
