import Partner from "../models/Partner.js";
import { uploadToR2 } from "../middleware/uploadR2.js";

const getLogoFile = (req) => {
  if (req.file) return req.file;
  if (Array.isArray(req.files)) return req.files[0];
  return req.files?.logo?.[0] || req.files?.image?.[0];
};

const cleanUrl = (value = "") => value.trim();

export const createPartner = async (req, res) => {
  try {
    const name = req.body.name?.trim();

    if (!name) {
      return res.status(400).json({ message: "Partner name is required" });
    }

    const logoFile = getLogoFile(req);
    const logoUrl = logoFile
      ? await uploadToR2(logoFile)
      : cleanUrl(req.body.logoUrl || "");

    if (!logoUrl) {
      return res.status(400).json({ message: "Partner logo is required" });
    }

    const partner = await Partner.create({
      name,
      logoUrl,
      websiteUrl: cleanUrl(req.body.websiteUrl || ""),
      category: req.body.category?.trim() || "Partner",
      status: req.body.status === "draft" ? "draft" : "published",
      order: Number(req.body.order) || 0,
    });

    res.status(201).json({ success: true, data: partner });
  } catch (error) {
    console.error("Create partner error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Partner create failed",
    });
  }
};

export const getPartners = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { status: "published" };
    const partners = await Partner.find(filter).sort({ order: 1, createdAt: -1 });

    res.json({ success: true, data: partners });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to load partners",
    });
  }
};

export const getPartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.json({ success: true, data: partner });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Invalid partner",
    });
  }
};

export const updatePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    if (req.body.name !== undefined) {
      const name = req.body.name.trim();
      if (!name) return res.status(400).json({ message: "Partner name is required" });
      partner.name = name;
    }

    if (req.body.logoUrl !== undefined) partner.logoUrl = cleanUrl(req.body.logoUrl);
    if (req.body.websiteUrl !== undefined) partner.websiteUrl = cleanUrl(req.body.websiteUrl);
    if (req.body.category !== undefined) partner.category = req.body.category.trim() || "Partner";
    if (req.body.status !== undefined) {
      partner.status = req.body.status === "draft" ? "draft" : "published";
    }
    if (req.body.order !== undefined) partner.order = Number(req.body.order) || 0;

    const logoFile = getLogoFile(req);
    if (logoFile) {
      partner.logoUrl = await uploadToR2(logoFile);
    }

    if (!partner.logoUrl) {
      return res.status(400).json({ message: "Partner logo is required" });
    }

    const updated = await partner.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update partner error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Partner update failed",
    });
  }
};

export const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    await partner.deleteOne();
    res.json({ success: true, message: "Partner deleted successfully" });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Delete failed",
    });
  }
};
