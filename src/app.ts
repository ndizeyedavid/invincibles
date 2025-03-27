import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import httpStatus from "http-status";
import config from "./config/config";
import passport from "./config/passport";
import morgan from "./config/morgan";
import xss from "./middleware/xss";
import { authLimiter } from "./middleware/rateLimiter";
import { errorConverter, errorHandler } from "./middleware/error";
import ApiError from "./utils/ApiError";
import SwaggerUi from "swagger-ui-express";
import Document from "../swagger.json";
import routes from "./routes/index.routes";
import { initCheckoutCron } from "./utils/clearBookis";
const app = express();
if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}
app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(xss());
app.use(compression());
app.use(passport.initialize());
// app.use(
//   cors({
//     origin: [
//       "https://scec-fn.vercel.app",
//       "http://localhost:4200",
//       "http://localhost:4201",
//       "http://localhost:5173",
//     ],
//   })
// );
app.use("*", cors());
app.use(passport.initialize());
app.use("/files", express.static("public/files"));

// update checkout mid night
initCheckoutCron();

if (config.env === "production") {
  app.use("/auth", authLimiter);
}
app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(Document));
app.use("/api/v1", routes);
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});
app.use(errorConverter);
app.use(errorHandler);
export default app;
