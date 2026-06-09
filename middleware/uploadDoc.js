// import multer from "multer";
// import crypto from "crypto";
// import path from "path";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 25 * 1024 * 1024 },
// });

// const r2 = new S3Client({
//   region: "auto",
//   endpoint: process.env.R2_ENDPOINT,
//   credentials: {
//     accessKeyId: process.env.R2_ACCESS_KEY,
//     secretAccessKey: process.env.R2_SECRET_KEY,
//   },
//   forcePathStyle: true,
// });

// export const uploadDoc = upload.single("file");

// // export const uploadToR2 = async (req, res, next) => {
// //   if (!req.file) return next();

// //   const ext = path.extname(req.file.originalname);
// //   const key = `publications/${Date.now()}-${crypto.randomUUID()}${ext}`;

// //   await r2.send(
// //     new PutObjectCommand({
// //       Bucket: process.env.R2_BUCKET_NAME,
// //       Key: key,
// //       Body: req.file.buffer,
// //       ContentType: req.file.mimetype,
// //     })
// //   );

// //   req.fileData = {
// //     fileUrl: `${process.env.R2_PUBLIC_URL}/${key}`,
// //     storageKey: key,
// //     mimetype: req.file.mimetype,
// //     size: req.file.size,
// //   };

// //   next();
// // };


// export const uploadToR2 = async (req, res, next) => {

// if (!req.files) return next();

// req.uploadedFiles = {};

// for (const field in req.files) {

// const file = req.files[field][0];

// const ext = path.extname(file.originalname);

// const key = `publications/${Date.now()}-${crypto.randomUUID()}${ext}`;

// await r2.send(
// new PutObjectCommand({
// Bucket: process.env.R2_BUCKET_NAME,
// Key: key,
// Body: file.buffer,
// ContentType: file.mimetype,
// })
// );

// req.uploadedFiles[field] = {
// url: `${process.env.R2_PUBLIC_URL}/${key}`,
// key: key,
// };

// }

// next();

// };


import multer from "multer";
import crypto from "crypto";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


// Multer memory storage

const upload = multer({

storage: multer.memoryStorage(),

limits: {

fileSize: 25 * 1024 * 1024,

},

});



// Cloudflare R2 config

const r2 = new S3Client({

region: "auto",

endpoint: process.env.R2_ENDPOINT,

credentials: {

accessKeyId: process.env.R2_ACCESS_KEY,

secretAccessKey: process.env.R2_SECRET_KEY,

},

forcePathStyle: true,

});



/*
IMPORTANT

image = publication image

file = PDF

*/

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



// save uploaded file info

req.uploadedFiles[fieldName] = {

url: `${process.env.R2_PUBLIC_URL}/${key}`,

key: key,

type: file.mimetype,

size: file.size,

};

}



next();

} catch (error) {

console.log("R2 Upload Error:", error);

return res.status(500).json({

message: `File upload failed: ${error.message}`,

error: error.message,

});

}

};
