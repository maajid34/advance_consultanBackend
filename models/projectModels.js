import mongoose from "mongoose";
import slugify from "slugify";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    activities: [
      {
        type: String,
      },
    ],

    location: String,
    client: String,
    date: String,
    websiteUrl: String,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    //   required: true,
    },

    image: {
      type: String,
      default: "",
    },

    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

projectSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

export default mongoose.model("Project", projectSchema);
