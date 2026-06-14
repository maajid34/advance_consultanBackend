import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    websiteUrl: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      default: "Partner",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Partner", partnerSchema);
