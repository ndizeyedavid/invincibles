import nodemailer from "nodemailer";
import { BadRequestError } from "../errors/BadRequestError";

async function senderEmailHandlerAsync(details: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    console.log(":::::::::::::;;;;;;", details);
    let transporter = nodemailer.createTransport({
      service: process.env.MAIL_HOST,
      // secure: false,
      // tls: { rejectUnauthorized: false },
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: `"SPECIAL GUEST BOOKING" <${process.env.MAIL_USER}>`,
      to: details.to,
      subject: details.subject,
      html: details.html,
    });

    return info;
  } catch (error) {
    if (process.env.NODE_ENV !== "development") {
      throw new BadRequestError(
        `Something went wrong sending email!,error: ${error}`
      );
    }
  }
}

export default senderEmailHandlerAsync;
