import { Response } from "express";
const respond = (
  res: Response,
  success: boolean,
  message: string,
  data?: any
) => {
  return res.status(200).json({ success, message, data });
};
export default respond;
