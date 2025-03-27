import { Request, Response, NextFunction } from "express";

import { findById } from "../services/userServices";
import { NotFoundError } from "../errors/NotFoundError";
function AuthorizedRole(...AcceptedStaffRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.User) return next(new NotFoundError("Something went wrong"));
    const { user_id } = req.authData;
    console.log(user_id);
    const user = await findById(user_id);
    if (!AcceptedStaffRoles.includes(user?.role?.toLowerCase()!))
      return res
        .status(403)
        .json({ message: "You are not allowed to perform this action" });
    next();
  };
}

export { AuthorizedRole };
