import Project from "../models/projectModels.js";
import { uploadToR2 } from "../middleware/uploadR2.js";

/* CREATE */
export const createProject = async (req, res, next) => {
  try {
    let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadToR2(req.file);
    }

    const project = await Project.create({
      ...req.body,
      image: imageUrl,
    });

    res.status(201).json(project);
  } catch (err) {
    next(err);
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

    // haddii sawir cusub la soo diray
    if (req.file) {
      project.image = await uploadToR2(req.file);
    }

    // update fields
    project.title = req.body.title ?? project.title;
    project.description = req.body.description ?? project.description;
    project.location = req.body.location ?? project.location;
    project.client = req.body.client ?? project.client;
    project.date = req.body.date ?? project.date;
    project.category = req.body.category ?? project.category;
    project.activities = req.body.activities ?? project.activities;

    const updated = await project.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
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
    res.status(400).json({ message: "Delete failed" });
  }
};