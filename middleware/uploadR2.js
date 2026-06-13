import dotenv from "dotenv";
dotenv.config();

import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

/* ================= MULTER ================= */
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
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
  const key = `projectss/${uuidv4()}-${file.originalname}`;

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


// /* ================= TEST FUNCTION ================= */
// export const testR2Connection = async () => {
//   try {
//     console.log("Testing R2 upload...");

//     await r2.send(
//       new PutObjectCommand({
//         Bucket: process.env.R2_BUCKET_NAME,
//         Key: "test.txt",
//         Body: "hello world",
//         ContentType: "text/plain",
//       })
//     );

//     console.log("✅ R2 TEST SUCCESS: test.txt uploaded");
//   } catch (error) {
//     console.error("❌ R2 TEST FAILED");
//     console.error(error);
//   }
// };

// /* AUTO RUN TEST */
// testR2Connection();


// console.log("R2_ACCESS_KEY:", process.env.R2_ACCESS_KEY);
// console.log("R2_SECRET_KEY:", process.env.R2_SECRET_KEY);
// console.log("R2_ENDPOINT:", process.env.R2_ENDPOINT);

