import dotenv from "dotenv";
import mongoose from "mongoose";
import Partner from "./models/Partner.js";

dotenv.config();

const partners = [
  {
    name: "UNICEF",
    logoUrl: "/partners/unicef.svg",
    websiteUrl: "https://www.unicef.org",
    category: "International Agency",
    order: 1,
  },
  {
    name: "European Union",
    logoUrl: "/partners/eu.svg",
    websiteUrl: "https://european-union.europa.eu",
    category: "Development Partner",
    order: 2,
  },
  {
    name: "Save the Children",
    logoUrl: "/partners/save-the-children.svg",
    websiteUrl: "https://www.savethechildren.net",
    category: "International NGO",
    order: 3,
  },
  {
    name: "Norwegian Refugee Council",
    logoUrl: "/partners/nrc.svg",
    websiteUrl: "https://www.nrc.no",
    category: "International NGO",
    order: 4,
  },
];

const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
};

if (process.env.MONGO_TLS_ALLOW_INVALID_CERTS === "true") {
  mongoOptions.tlsAllowInvalidCertificates = true;
}

const seedPartners = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is required");
    }

    await mongoose.connect(process.env.MONGO_URI, mongoOptions);

    for (const partner of partners) {
      await Partner.findOneAndUpdate(
        { name: partner.name },
        { ...partner, status: "published" },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log("Partners seeded successfully");
  } catch (error) {
    console.error("Partner seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedPartners();
