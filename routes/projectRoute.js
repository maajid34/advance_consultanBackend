import express from "express";
import {
  createProject,
  getProjects,
  getSingleProjectBySlug,
  getProjectsByCategory,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controlls/projectCntrolls.js";

import { upload } from "../middleware/uploadR2.js";
import { protect, adminOnly } from "../middleware/Auth.js";

const router = express.Router();

/* CREATE */
router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 12 },
    { name: "image", maxCount: 12 },
  ]),
  createProject
);

/* READ */
router.get("/", getProjects);
router.get("/category/:categoryId", getProjectsByCategory);

/* IMPORTANT: ORDER & PATH */
router.get("/id/:id", getProjectById);          // ✅ ID
router.get("/slug/:slug", getSingleProjectBySlug); // ✅ SLUG

/* UPDATE */
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 12 },
    { name: "image", maxCount: 12 },
  ]),
  updateProject
);

/* DELETE */
router.delete("/:id", deleteProject);

export default router;
