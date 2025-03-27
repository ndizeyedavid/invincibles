import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    //@ts-ignore
    folder: "scec",
  },
});

export default storage;
