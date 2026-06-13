import dotenv from "dotenv";
import mongoose from "mongoose";
import Testimonial from "./models/Testimonial.js";

dotenv.config();

const testimonials = [
  {
    name: "Amina Hussein",
    role: "Operations Lead",
    organization: "Local NGO",
    message:
      "Advance Consultant helped us set up our digital presence smoothly. Their professionalism is unmatched.",
    imageUrl: "/logo1.png",
    rating: 5,
    order: 1,
  },
  {
    name: "Abdi Farah",
    role: "Program Coordinator",
    organization: "Development Partner",
    message:
      "Great experience. The team supported our project from start to finish with excellent communication.",
    imageUrl: "/logo1.png",
    rating: 5,
    order: 2,
  },
  {
    name: "Fatima Ali",
    role: "Project Manager",
    organization: "Community Organization",
    message:
      "Their consultancy services improved our workflow and made our reporting process clearer.",
    imageUrl: "/logo1.png",
    rating: 5,
    order: 3,
  },
  {
    name: "Mohamed Ibrahim",
    role: "Director",
    organization: "Private Sector Client",
    message:
      "I was impressed by their data analysis solutions and the clarity of the final reporting.",
    imageUrl: "/logo1.png",
    rating: 5,
    order: 4,
  },
];

const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
};

if (process.env.MONGO_TLS_ALLOW_INVALID_CERTS === "true") {
  mongoOptions.tlsAllowInvalidCertificates = true;
}

const seedTestimonials = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is required");
    }

    await mongoose.connect(process.env.MONGO_URI, mongoOptions);

    for (const item of testimonials) {
      await Testimonial.findOneAndUpdate(
        { name: item.name },
        { ...item, status: "published" },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log("Testimonials seeded successfully");
  } catch (error) {
    console.error("Testimonial seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedTestimonials();
