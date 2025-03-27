import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const allowedMimeTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

// Create upload directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'public', 'documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const createMulterStorage = (prefix: string) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${prefix}-${file.originalname}-${Date.now()}`);
    },
  });
};

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, image, and Excel files are allowed.'));
  }
};

/**
 * @title createUpload()
 * @description Create a new upload with multer
 * @param allowNoFile Define whether to allow empty file or nor 
 * @returns multer instance
 */
export const createUpload = ({ prefix, maxSizeAllowed, allowNoFile }: { 
  prefix?: string, 
  maxSizeAllowed?: number, 
  allowNoFile?: boolean 
}) => {
  const upload = multer({
    storage: createMulterStorage(prefix || "general"),
    fileFilter,
    limits: {
      fileSize: maxSizeAllowed || 5 * 1024 * 1024
    }
  });

  // Return a middleware function that handles both cases
  return (field: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.is('multipart/form-data')) {
        // If it's not a multipart request and allowNoFile is true, skip file processing
        if (allowNoFile) {
          return next();
        }
        // Otherwise, return an error
        return next(new Error('Missing file upload'));
      }

      // Use multer's single file upload
      upload.single(field)(req, res, (err) => {
        if (err) {
          // If there's no file and allowNoFile is true, continue
          if (err.code === 'LIMIT_UNEXPECTED_FILE' && allowNoFile) {
            return next();
          }
          return next(err);
        }
        next();
      });
    };
  };
};