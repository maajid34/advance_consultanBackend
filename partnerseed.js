import dotenv from "dotenv";
import mongoose from "mongoose";
import Partner from "./models/Partner.js";

dotenv.config();

const partners = [
  {
    name: "Aayareeb Governance & Research Consultants",
    logoUrl: "https://aayareeb.com/assets/logo1-ZWxEOPz0.png",
    websiteUrl: "https://aayareeb.com/",
    category: "Client",
    order: 1,
  },
  {
    name: "Community Action for Climate Change (CACC)",
    logoUrl: "https://caccsom.org/assets/logo-85ko3cQe.png",
    websiteUrl: "https://caccsom.org/",
    category: "Client",
    order: 2,
  },
  {
    name: "Hope Springs Network Somalia",
    logoUrl: "https://hopes-springs.org/assets/logo-DvlJARLQ.png",
    websiteUrl: "https://hopes-springs.org/",
    category: "Client",
    order: 3,
  },
  {
    name: "Ministry of Energy & Water Resources - Jubaland",
    logoUrl: "https://moewr-jubalandstate.so/assets/tamarta-B4uTrg6p.png",
    websiteUrl: "https://moewr-jubalandstate.so/",
    category: "Client",
    order: 4,
  },
  {
    name: "Keystone Consultant",
    logoUrl: "https://keystone-consultant.com/Assets/logo.png",
    websiteUrl: "https://keystone-consultant.com/",
    category: "Client",
    order: 5,
  },
  {
    name: "Hayaat Logistic",
    logoUrl: "https://hayaat-logistic.vercel.app/img/hayaat/logo.png",
    websiteUrl: "https://hayaat-logistic.vercel.app/",
    category: "Client",
    order: 6,
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
