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
// import authRoutes from "./routes/UserRoute.js";

dotenv.config();
const app = express();

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
};

if (process.env.MONGO_TLS_ALLOW_INVALID_CERTS === "true") {
  mongoOptions.tlsAllowInvalidCertificates = true;
}

// ===== MongoDB Connection (Clean & Updated) =====
mongoose
  .connect(process.env.MONGO_URI, mongoOptions)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Error:", err));



//   routes
// app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5300;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
