import { Request, Response } from "express";
import userServices from "../services/userServices";
import { generateId } from "../utils/generateId";
import { User } from "../types/user";
import { sign } from "../utils/jwt";
import { encryptPassword, isPasswordMatch } from "../utils/encryption";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { randomPassword } from "../utils/crypto";
import response from "../utils/response";
import respond from "../utils/response";
import senderEmailHandlerAsync from "../utils/sendEmail";
import { forgetPasswordEmailTemplate } from "../utils/emailTemplates";

export const googleAuthCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as User;
    delete (user as any).id;
    const token = await sign({ user_id: user.user_id });
    if (!user.google_id) {
      return res.redirect(`${process.env.FRONT_END_BASE_URL}/sign-in`);
    }
    res.redirect(
      `${
        process.env.FRONT_END_BASE_URL
      }/home?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`
    );
  } catch (error) {
    console.error("Google auth callback error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const user_id = generateId();
    const password = await encryptPassword(req.body?.password);
    const email = req.body.email.toLowerCase();
    const userExist = await userServices.findByEmail(email);
    if (userExist)
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already exist");
    let avatar = null;
    if (req.file !== undefined) {
      avatar = `https://lala-eiv6.onrender.com/files/${req.file.filename}`;
    }
    await userServices.create({
      ...req.body,
      user_id,
      password,
      email,
      avatar:
        avatar ??
        "https://res.cloudinary.com/kist/image/upload/v1711023040/scec/bs89knpuvkithg1wblng.jpg",
    });
    const user = await userServices.findById(user_id);
    if (!user)
      throw new ApiError(httpStatus.NOT_FOUND, "Failed to find created user.");
    const token = await sign({ user_id: user_id });
    return res.status(200).json({
      success: true,
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error("Error create user:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const user = await userServices.findByEmail(email);
    if (!user || !(await isPasswordMatch(password, user?.password ?? "")))
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Invalid user name or password."
      );
    const token = await sign({ user_id: user.user_id });
    return res.status(200).json({
      success: true,
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error("Error login:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const user = await userServices.findByEmail(email);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
    const token = await randomPassword();
    const password_reset_token = await encryptPassword(token);
    const password_changed_at = new Date();
    const password_reset_experis_in = new Date(Date.now() + 5 * 60 * 100); //5 min
    await userServices.forgetPassword(
      {
        password_changed_at,
        password_reset_experis_in,
        password_reset_token,
      },
      user.user_id
    );
    await senderEmailHandlerAsync({
      to: user.email,
      subject: "Reset password",
      html: forgetPasswordEmailTemplate({
        resetLink: `${process.env.PASSWORD_RESET_URL!}/?token=${token}&email=${
          user.email
        }`,
      }),
    });
    return respond(res, true, "Check your email to reset password.", token);
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, email } = req.query;
    const password = req.body;
    const user = await userServices.findByEmail(email as string);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
    if (!user.password_reset_token)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "There is no reset token. Please Click on forget password."
      );
    const isValidToken = await isPasswordMatch(
      token as string,
      user.password_reset_token!
    );
    if (!isValidToken)
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid token");
    if (
      user.password_reset_experis_in &&
      user.password_reset_experis_in?.getTime() < Date.now()
    )
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Oops! Your reset token is expired, please try again."
      );
    const hashedPassword = await encryptPassword(req.body?.password);
    await userServices.updatePassword(hashedPassword, user.user_id);
    const JwtToken = await sign({ user_id: user.user_id });
    return res.status(200).json({
      success: true,
      token: JwtToken,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error("Error reset password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { password, new_password } = req.body;
    const user = await userServices.findById(req.authData.user_id);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
    if (!user.password)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not allowed to do this action"
      );
    const isPasswordValid = await isPasswordMatch(password, user.password);
    if (!isPasswordValid)
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid password");
    await userServices.updatePassword(
      await encryptPassword(new_password),
      user.user_id
    );
    respond(res, true, "Password updated successfully!");
  } catch (error: any) {
    console.error("Error change password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const userId = req.authData.user_id;
    let avatar = null;
    if (req.file !== undefined) {
      avatar = req.file.filename;
    }
    await userServices.update({
      ...req.body,
      email: req.body.email.toLowerCase(),
      user_id: userId,
      avatar,
    });
    const user = await userServices.findByEmail(req.body.email);
    if (!user)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Something Went wrong, try again."
      );
    respond(res, true, "User update successfully!", {
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const findMany = async (req: Request, res: Response) => {
  try {
    const users = await userServices.findMany();
    if (users.length == 0)
      throw new ApiError(httpStatus.NOT_FOUND, "Users does not exist.");
    respond(res, true, "Users found successfully.", users);
  } catch (error: any) {
    console.error("Error find users:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const findById = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const user = await userServices.findById(user_id);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User does not Exist.");
    respond(res, true, "User found successfully!", user);
  } catch (error: any) {
    console.error("Error find user:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const findProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.authData.user_id;
    const user = await userServices.findById(userId);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User does not Exist.");
    respond(res, true, "User found successfully!", user);
  } catch (error: any) {
    console.error("Error find user:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const deleteById = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const user = await userServices.findById(user_id);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
    if (user.user_id !== req.authData.user_id)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to delete This account."
      );
    await userServices.deleteAccount(req.authData.user_id);
    return respond(res, true, "Account deleted successfuly.");
  } catch (error: any) {
    console.error("Error delete user:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const restoreUser = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    console.error("Error reset password:", error);
    return res.status(error?.statusCode || 500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};
