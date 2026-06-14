import Publication from "../models/publicactionModel.js";

const getTrimmedValue = (value) => (typeof value === "string" ? value.trim() : "");

export const createPublication = async (req, res) => {
  try {
    const title = getTrimmedValue(req.body.title);
    const description = getTrimmedValue(req.body.description);
    const moreDescription = getTrimmedValue(req.body.moreDescription);

    if (!title || !description || !moreDescription) {
      return res.status(400).json({
        success: false,
        message: "Title, short description, and full description are required",
      });
    }

    const image = req.uploadedFiles?.image;
    const pdf = req.uploadedFiles?.file;

    if (!image || !pdf) {
      return res.status(400).json({
        success: false,
        message: "Publication image and document file are required",
      });
    }

    const publication = await Publication.create({
      title,
      description,
      moreDescription,
      imageUrl: image.url,
      pdfUrl: pdf.url,
      pdfKey: pdf.key,
    });

    res.status(201).json({ success: true, data: publication });
  } catch (error) {
    console.error("Create publication error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Publication create failed",
    });
  }
};

export const getPublications = async (req, res) => {
  try {
    const publications = await Publication.find().sort({ createdAt: -1 });
    res.json({ success: true, data: publications });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to load publications",
    });
  }
};

export const getPublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    res.json({ success: true, data: publication });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Invalid publication",
    });
  }
};

export const updatePublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    const title = getTrimmedValue(req.body.title);
    const description = getTrimmedValue(req.body.description);
    const moreDescription = getTrimmedValue(req.body.moreDescription);

    if (req.body.title !== undefined) {
      if (!title) return res.status(400).json({ success: false, message: "Title is required" });
      publication.title = title;
    }
    if (req.body.description !== undefined) {
      if (!description) {
        return res.status(400).json({ success: false, message: "Short description is required" });
      }
      publication.description = description;
    }
    if (req.body.moreDescription !== undefined) {
      if (!moreDescription) {
        return res.status(400).json({ success: false, message: "Full description is required" });
      }
      publication.moreDescription = moreDescription;
    }

    if (req.uploadedFiles?.image) {
      publication.imageUrl = req.uploadedFiles.image.url;
    }
    if (req.uploadedFiles?.file) {
      publication.pdfUrl = req.uploadedFiles.file.url;
      publication.pdfKey = req.uploadedFiles.file.key;
    }

    const updated = await publication.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update publication error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Publication update failed",
    });
  }
};

export const deletePublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    await publication.deleteOne();
    res.json({ success: true, message: "Publication deleted successfully" });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Delete failed",
    });
  }
};
