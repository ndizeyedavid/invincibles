import "dotenv/config";
import { promisify } from "util";
import JWT from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRY ?? "10d";
export const sign = async (payload: { user_id: string }) => {
  // @ts-ignore
  return await promisify(JWT.sign)(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verify = async (payload: string) =>
  // @ts-ignore
  await promisify(JWT.verify)(payload, JWT_SECRET);
