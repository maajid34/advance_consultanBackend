import dotenv from "dotenv";
dotenv.config();

import multer from "multer";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

/* ================= MULTER ================= */
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (!allowedImageTypes.has(file.mimetype)) {
      return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }

    cb(null, true);
  },
});

/* ================= CLOUDFLARE R2 CLIENT ================= */
export const r2 = new S3Client({
  region: "us-east-1", // ⚠️ QASAB
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
  forcePathStyle: true, // ⚠️ QASAB R2
});

/* ================= UPLOAD FUNCTION ================= */
export const uploadToR2 = async (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const key = `projects/${uuidv4()}${ext}`;

  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );
  } catch (error) {
    console.error("R2 upload failed:", error);
    throw new Error(`Image upload failed: ${error.message || "R2 upload error"}`);
  }

  return `${process.env.R2_PUBLIC_URL}/${key}`;
};

