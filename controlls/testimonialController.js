import Testimonial from "../models/Testimonial.js";
import { uploadToR2 } from "../middleware/uploadR2.js";

const getImageFile = (req) => {
  if (req.file) return req.file;
  if (Array.isArray(req.files)) return req.files[0];
  return req.files?.image?.[0] || req.files?.avatar?.[0];
};

const normalizeRating = (value) => {
  const rating = Number(value);
  if (!Number.isFinite(rating)) return 5;
  return Math.min(5, Math.max(1, rating));
};

export const createTestimonial = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const message = req.body.message?.trim();

    if (!name || !message) {
      return res.status(400).json({ message: "Name and message are required" });
    }

    const imageFile = getImageFile(req);
    const imageUrl = imageFile
      ? await uploadToR2(imageFile)
      : req.body.imageUrl?.trim() || "";

    const testimonial = await Testimonial.create({
      name,
      message,
      imageUrl,
      role: req.body.role?.trim() || "",
      organization: req.body.organization?.trim() || "",
      rating: normalizeRating(req.body.rating),
      status: req.body.status === "draft" ? "draft" : "published",
      order: Number(req.body.order) || 0,
    });

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    console.error("Create testimonial error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Testimonial create failed",
    });
  }
};

export const getTestimonials = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { status: "published" };
    const testimonials = await Testimonial.find(filter).sort({
      order: 1,
      createdAt: -1,
    });

    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to load testimonials",
    });
  }
};

export const getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Invalid testimonial",
    });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    if (req.body.name !== undefined) {
      const name = req.body.name.trim();
      if (!name) return res.status(400).json({ message: "Name is required" });
      testimonial.name = name;
    }

    if (req.body.message !== undefined) {
      const message = req.body.message.trim();
      if (!message) return res.status(400).json({ message: "Message is required" });
      testimonial.message = message;
    }

    if (req.body.role !== undefined) testimonial.role = req.body.role.trim();
    if (req.body.organization !== undefined) {
      testimonial.organization = req.body.organization.trim();
    }
    if (req.body.rating !== undefined) testimonial.rating = normalizeRating(req.body.rating);
    if (req.body.status !== undefined) {
      testimonial.status = req.body.status === "draft" ? "draft" : "published";
    }
    if (req.body.order !== undefined) testimonial.order = Number(req.body.order) || 0;
    if (req.body.imageUrl !== undefined) testimonial.imageUrl = req.body.imageUrl.trim();

    const imageFile = getImageFile(req);
    if (imageFile) {
      testimonial.imageUrl = await uploadToR2(imageFile);
    }

    const updated = await testimonial.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update testimonial error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Testimonial update failed",
    });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    await testimonial.deleteOne();
    res.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Delete failed",
    });
  }
};
