import multer from "multer";
import storage from "./cloudinary";

const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg", // JPEG images
  "image/png", // PNG images
];
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/files");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-BkD-${file.originalname}`);
//   },
// });
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF and image files are allowed."));
  }
};
const uploadFile = multer({
  storage: storage, //@ts-ignore
  fileFilter,
  limits: { fileSize: 1048576 },
});

export default uploadFile;
