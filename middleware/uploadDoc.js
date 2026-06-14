import crypto from "crypto";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";

const allowedTypesByField = {
  image: new Set(["image/jpeg", "image/png", "image/webp"]),
  file: new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]),
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const allowedTypes = allowedTypesByField[file.fieldname];

    if (!allowedTypes || !allowedTypes.has(file.mimetype)) {
      return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }

    cb(null, true);
  },
});

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
  forcePathStyle: true,
});

export const uploadDoc = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

export const uploadToR2 = async (req, res, next) => {
  try {
    if (!req.files) {
      return next();
    }

    req.uploadedFiles = {};

    for (const fieldName in req.files) {
      const file = req.files[fieldName][0];
      const ext = path.extname(file.originalname);
      const key = `publications/${Date.now()}-${crypto.randomUUID()}${ext}`;

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      req.uploadedFiles[fieldName] = {
        url: `${process.env.R2_PUBLIC_URL}/${key}`,
        key,
        type: file.mimetype,
        size: file.size,
      };
    }

    next();
  } catch (error) {
    console.error("R2 publication upload failed:", error);
    next(new Error(`File upload failed: ${error.message || "R2 upload error"}`));
  }
};
