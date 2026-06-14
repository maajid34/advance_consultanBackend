import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "./models/userModels.js";

const adminPassword = process.env.SEED_ADMIN_PASSWORD;
const userPassword = process.env.SEED_USER_PASSWORD;

if (!adminPassword || adminPassword.length < 8) {
  throw new Error("SEED_ADMIN_PASSWORD is required and must be at least 8 characters");
}

const users = [
  {
    name: "Advance Admin",
    email: process.env.SEED_ADMIN_EMAIL || "advance@gmail.com",
    password: adminPassword,
    role: "admin",
    status: "active",
  },
  ...(userPassword
    ? [
        {
          name: "Advance User",
          email: process.env.SEED_USER_EMAIL || "user@advance-consultant.site",
          password: userPassword,
          role: "user",
          status: "active",
        },
      ]
    : []),
];

const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
};

if (process.env.MONGO_TLS_ALLOW_INVALID_CERTS === "true") {
  mongoOptions.tlsAllowInvalidCertificates = true;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectWithRetry(attempts = 5) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await mongoose.connect(process.env.MONGO_URI, mongoOptions);
      return;
    } catch (error) {
      lastError = error;
      console.log(`Mongo connection failed (${attempt}/${attempts}): ${error.message}`);
      await wait(2000 * attempt);
    }
  }

  throw lastError;
}

async function seedUsers() {
  console.log("Connecting to MongoDB...");
  await connectWithRetry();
  console.log("MongoDB connected. Seeding users...");

  for (const seedUser of users) {
    const email = seedUser.email.toLowerCase();
    console.log(`Seeding: ${email}`);

    const user = await User.findOne({ email });

    if (user) {
      user.name = seedUser.name;
      user.password = seedUser.password;
      user.role = seedUser.role;
      user.status = seedUser.status;
      await user.save();
    } else {
      await User.create({
        ...seedUser,
        email,
      });
    }
  }

  await mongoose.disconnect();
  console.log(`Seeded ${users.length} users`);
}

seedUsers().catch(async (error) => {
  console.error("User seed failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
