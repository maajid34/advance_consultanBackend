import Blog from "../models/Blog.js";
import { uploadToR2 } from "../middleware/uploadR2.js";

const slugify = (value) =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const parseTags = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((tag) => tag.trim()).filter(Boolean);

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const getCoverFile = (req) => {
  if (req.file) return req.file;
  if (Array.isArray(req.files)) return req.files[0];
  return req.files?.image?.[0] || req.files?.cover?.[0];
};

const getUniqueSlug = async (title, currentId) => {
  const base = slugify(title);
  let slug = base;
  let counter = 2;

  while (
    await Blog.exists({
      slug,
      ...(currentId ? { _id: { $ne: currentId } } : {}),
    })
  ) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
};

export const createBlog = async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const excerpt = req.body.excerpt?.trim();
    const content = req.body.content?.trim();

    if (!title || !excerpt || !content) {
      return res.status(400).json({
        message: "Title, excerpt, and content are required",
      });
    }

    const coverFile = getCoverFile(req);
    if (!coverFile) {
      return res.status(400).json({ message: "Blog cover image is required" });
    }

    const imageUrl = await uploadToR2(coverFile);
    const slug = await getUniqueSlug(title);

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      imageUrl,
      category: req.body.category?.trim() || "Insights",
      tags: parseTags(req.body.tags),
      author: req.body.author?.trim() || "Advance Consultant",
      status: req.body.status === "draft" ? "draft" : "published",
      publishedAt: req.body.publishedAt || Date.now(),
    });

    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    console.error("CREATE BLOG ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Blog create failed",
    });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { status: "published" };
    const blogs = await Blog.find(filter).sort({ publishedAt: -1, createdAt: -1 });

    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlog = async (req, res) => {
  try {
    const filter =
      req.params.idOrSlug.match(/^[0-9a-fA-F]{24}$/)
        ? { _id: req.params.idOrSlug }
        : { slug: req.params.idOrSlug };

    const blog = await Blog.findOne(filter);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Invalid blog" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (req.body.title !== undefined) {
      const title = req.body.title.trim();
      if (!title) return res.status(400).json({ message: "Title is required" });
      blog.title = title;
      blog.slug = await getUniqueSlug(title, blog._id);
    }

    if (req.body.excerpt !== undefined) blog.excerpt = req.body.excerpt.trim();
    if (req.body.content !== undefined) blog.content = req.body.content.trim();
    if (req.body.category !== undefined) blog.category = req.body.category.trim() || "Insights";
    if (req.body.tags !== undefined) blog.tags = parseTags(req.body.tags);
    if (req.body.author !== undefined) blog.author = req.body.author.trim() || "Advance Consultant";
    if (req.body.status !== undefined) {
      blog.status = req.body.status === "draft" ? "draft" : "published";
    }
    if (req.body.publishedAt !== undefined) blog.publishedAt = req.body.publishedAt || Date.now();

    const coverFile = getCoverFile(req);
    if (coverFile) {
      blog.imageUrl = await uploadToR2(coverFile);
    }

    if (!blog.excerpt || !blog.content) {
      return res.status(400).json({ message: "Excerpt and content are required" });
    }

    const updated = await blog.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("UPDATE BLOG ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Blog update failed",
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.deleteOne();
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Delete failed" });
  }
};
