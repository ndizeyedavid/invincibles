import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import UserService from "../services/userServices";
import { verify } from "../utils/jwt";
import { NotFoundError } from "../errors/NotFoundError";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

dotenv.config();

interface UserAuthPayload {
  iat: number;
  exp: number;
  user_id: string;
}
interface User {
  user_id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: string | null;
  google_id: string | null;
  isVerified: boolean;
  phoneNumber: string | null;
  password: string;
  password_changed_at: Date;
  password_reset_experis_in: Date;
  password_reset_token: string;
  createdAt: Date;
  updatedAt: Date;
  deleted_at: Date | null;
  status: string;
}
declare global {
  namespace Express {
    interface Request {
      authData: UserAuthPayload;
      User: User;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  const headerAutho = req.headers.authorization;
  if (headerAutho && headerAutho.startsWith("Bearer")) {
    token = headerAutho.split(" ")[1];
  }

  if (!token) {
    return next(new UnauthorizedError());
  }
  try {
    const payload = await verify(token);
    //@ts-ignore
    const user = await UserService.findById(payload.user_id);
    if (!user) return next(new NotFoundError("User does not exist"));
    //@ts-ignore
    const tokenIsuedAt = payload.iat;
    if (
      user.password_changed_at &&
      tokenIsuedAt < user.password_changed_at.getTime() / 1000
    )
      throw new ApiError(
        httpStatus.NOT_ACCEPTABLE,
        "password has been changed, Please try to log in again."
      );
    //@ts-ignore
    req.authData = payload;
    req.User = user;
    next();
  } catch (error) {
    return next(new UnauthorizedError());
  }
};
