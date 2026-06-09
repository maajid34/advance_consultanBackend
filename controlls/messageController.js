import ContactMessage from "../models/ContactMessage.js";

export const createMessage = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim();
    const message = req.body.message?.trim();

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email, and message are required",
      });
    }

    const savedMessage = await ContactMessage.create({
      name,
      email,
      message,
      phone: req.body.phone?.trim() || "",
      subject: req.body.subject?.trim() || "Website inquiry",
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.error("CREATE MESSAGE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Message send failed",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markMessageRead = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: "read" },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ success: true, data: message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Update failed" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.deleteOne();
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Delete failed" });
  }
};
