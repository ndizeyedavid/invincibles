import { randomBytes } from "crypto";

const randomPassword = async () => {
  return randomBytes(5).toString("hex");
};

export { randomPassword };
