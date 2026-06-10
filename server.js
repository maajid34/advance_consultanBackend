// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";

// import projectRoutes from "./routes/projectRoute.js";
// import authRoutes from "./routes/UserRoute.js";
// import categoryRoutes from "./routes/categoryRoutes.js";
// import publicationRoutes from "./routes/publicationRouter.js";
// import blogRoutes from "./routes/blogRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js";
// // import authRoutes from "./routes/UserRoute.js";

// dotenv.config();
// const app = express();

// const corsOptions = {
//   origin: true,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));
// app.options(/.*/, cors(corsOptions));
// app.use(express.json());

// const mongoOptions = {
//   serverSelectionTimeoutMS: 5000,
// };

// if (process.env.MONGO_TLS_ALLOW_INVALID_CERTS === "true") {
//   mongoOptions.tlsAllowInvalidCertificates = true;
// }

// // ===== MongoDB Connection (Clean & Updated) =====
// mongoose
//   .connect(process.env.MONGO_URI, mongoOptions)
//   .then(() => console.log("✅ MongoDB Connected Successfully"))
//   .catch((err) => console.log("❌ MongoDB Error:", err));



// //   routes
// // app.use("/api/auth", authRoutes);
// app.use("/api/projects", projectRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api/publications", publicationRoutes);
// app.use("/api/blogs", blogRoutes);
// app.use("/api/messages", messageRoutes);

// const PORT = process.env.PORT || 5300;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import projectRoutes from "./routes/projectRoute.js";
import authRoutes from "./routes/UserRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import publicationRoutes from "./routes/publicationRouter.js";
import blogRoutes from "./routes/blogRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://advance-consultant.site",
  "https://www.advance-consultant.site",
  "https://advance-consultan-frontend.vercel.app",
  "https://advance-consultan-frontend.vercel.app/",
  "http://localhost:5173",
  "http://localhost:5300",
];

// Strong CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
};

if (process.env.MONGO_TLS_ALLOW_INVALID_CERTS === "true") {
  mongoOptions.tlsAllowInvalidCertificates = true;
}

mongoose
  .connect(process.env.MONGO_URI, mongoOptions)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Advance Consultant API is running",
  });
});

app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/messages", messageRoutes);

// 404 handler with CORS headers
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handler with CORS headers
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5300;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});