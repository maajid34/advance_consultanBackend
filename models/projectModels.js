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

projectSchema.pre("save", async function (next) {
  if (!this.isModified("title")) {
    return next();
  }

  const baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 2;

  while (
    await mongoose.models.Project.exists({
      slug,
      _id: { $ne: this._id },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  this.slug = slug;
  next();
});

export default mongoose.model("Project", projectSchema);
