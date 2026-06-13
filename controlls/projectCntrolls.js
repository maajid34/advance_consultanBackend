import Project from "../models/projectModels.js";
import { uploadToR2 } from "../middleware/uploadR2.js";

const getUploadedFiles = (req) => {
  if (Array.isArray(req.files)) return req.files;

  return [
    ...(req.files?.images || []),
    ...(req.files?.image || []),
    ...(req.file ? [req.file] : []),
  ];
};

const getActivities = (body, fallback = []) => {
  const activities = body.activities ?? body["activities[]"] ?? fallback;
  return Array.isArray(activities) ? activities : [activities];
};

const cleanOptionalValue = (value, fallback = "") => {
  if (value === undefined) return fallback;
  return value === "" ? "" : value;
};

/* CREATE */
export const createProject = async (req, res, next) => {
  try {
    const imageUrls = await Promise.all(
      getUploadedFiles(req).map((file) => uploadToR2(file))
    );

    if (imageUrls.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one project image is required" });
    }

    const activities = getActivities(req.body).filter(Boolean);
    const category = req.body.category || undefined;

    const project = await Project.create({
      ...req.body,
      category,
      activities,
      image: imageUrls[0],
      images: imageUrls,
    });

    res.status(201).json(project);
  } catch (err) {
    console.error("Project create error:", err);
    res.status(400).json({
      message: err.message || "Create failed",
      error: err.message,
    });
  }
};

/* GET ALL */
export const getProjects = async (req, res) => {
  const projects = await Project.find()
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  res.json(projects);
};

/* GET BY ID */
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("category", "name slug");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch {
    res.status(400).json({ message: "Invalid project ID" });
  }
};

/* GET BY SLUG */
export const getSingleProjectBySlug = async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug })
    .populate("category", "name slug");

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(project);
};

/* GET BY CATEGORY */
export const getProjectsByCategory = async (req, res) => {
  const projects = await Project.find({
    category: req.params.categoryId,
  }).populate("category", "name slug");

  res.json(projects);
};



export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const imageUrls = await Promise.all(
      getUploadedFiles(req).map((file) => uploadToR2(file))
    );

    if (imageUrls.length > 0) {
      project.image = imageUrls[0];
      project.images = imageUrls;
    }

    // update fields
    project.title = cleanOptionalValue(req.body.title, project.title);
    project.description = cleanOptionalValue(req.body.description, project.description);
    project.location = cleanOptionalValue(req.body.location, project.location);
    project.client = cleanOptionalValue(req.body.client, project.client);
    project.date = cleanOptionalValue(req.body.date, project.date);
    project.websiteUrl = cleanOptionalValue(req.body.websiteUrl, project.websiteUrl);
    if (Object.hasOwn(req.body, "category")) {
      project.category = req.body.category || undefined;
    }
    project.activities = getActivities(req.body, project.activities).filter(Boolean);

    const updated = await project.save();
    res.json(updated);
  } catch (err) {
    console.error("Project update error:", err);
    res.status(400).json({
      message: err.message || "Update failed",
      error: err.message,
    });
  }
};

/* ================= DELETE ================= */
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Project delete error:", err);
    res.status(400).json({ message: err.message || "Delete failed" });
  }
};
