import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import projectRoutes from "./routes/projectRoute.js";
import authRoutes from "./routes/UserRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import publicationRoutes from "./routes/publicationRouter.js";
// import authRoutes from "./routes/UserRoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ===== MongoDB Connection (Clean & Updated) =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Error:", err));



//   routes
// app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/publications", publicationRoutes);

const PORT = process.env.PORT || 5300;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
