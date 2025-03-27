import express from "express";
import { requireAuth } from "../middleware/RequireAuth";
import validation from "../middleware/validation";
import * as AuthController from "../controllers/AuthControllers";
import UserValidationSchema from "../validations/userValidation";
import uploadFile from "../config/multer";
import passport from "passport";

const router = express.Router();

// router.use(requireAuth);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  AuthController.googleAuthCallback
);

router.post(
  "/",
  uploadFile.single("avatar"),
  validation(UserValidationSchema.create),
  AuthController.create
);

router.post(
  "/login",
  validation(UserValidationSchema.login),
  AuthController.login
);
router.patch(
  "/",
  validation(UserValidationSchema.update),
  requireAuth,
  AuthController.update
);

router.post(
  "/change-password",
  requireAuth,
  validation(UserValidationSchema.changePassword),
  AuthController.changePassword
);

router.post(
  "/forgot",
  validation(UserValidationSchema.forgot),
  AuthController.forgotPassword
);
router.post(
  "/reset",
  validation(UserValidationSchema.reset),
  AuthController.resetPassword
);
router.get("/", AuthController.findMany);
router.get("/:user_id", AuthController.findById);
router.get("/profile", requireAuth, AuthController.findProfile);
router.delete("/:user_id", requireAuth, AuthController.deleteById);

export default router;
