import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Blog from "./models/Blog.js";

const blogs = [
  {
    title: "How Somali organizations can prepare better project proposals",
    slug: "proposal-preparation-for-somali-organizations",
    category: "Consulting",
    excerpt:
      "Strong proposals connect evidence, clear budgets, measurable outcomes, and a delivery plan that partners can trust.",
    content:
      "A strong project proposal starts with a clear problem statement and evidence from the field. Organizations should explain who is affected, why the issue matters, and how the proposed activity will create measurable improvement.\n\nThe proposal should also include a realistic work plan, clear responsibilities, and indicators that show how success will be measured. Donors and partners look for confidence: a team that understands the context, can manage resources carefully, and can report progress honestly.\n\nAdvance Consultant supports organizations by turning ideas into structured concept notes, proposals, budgets, implementation plans, and monitoring frameworks.",
    tags: ["Proposal", "Consulting", "Planning"],
    imageUrl: "/project-images/consulting-team.png",
  },
  {
    title: "Why every growing organization needs a clean website strategy",
    slug: "clean-website-strategy-for-growing-organizations",
    category: "Web Development",
    excerpt:
      "A useful website helps visitors understand services, verify credibility, and contact the team quickly.",
    content:
      "A website is often the first place a client, donor, or partner checks before starting a conversation. A clean website strategy makes sure the organization is easy to understand, easy to trust, and easy to contact.\n\nThe strongest websites organize information around user needs. Visitors should quickly see what the organization does, where it works, which projects it has delivered, and how to reach the team. Performance, mobile responsiveness, and SEO also matter because many users browse on phones and search through Google.\n\nAdvance Consultant builds websites that combine professional design, practical content structure, secure hosting, domain setup, and long-term maintainability.",
    tags: ["Website", "SEO", "Digital"],
    imageUrl: "/project-images/keystone.jpg",
  },
  {
    title: "Turning assessment data into dashboards that leaders can use",
    slug: "turning-assessment-data-into-useful-dashboards",
    category: "Data & Reporting",
    excerpt:
      "Dashboards become valuable when indicators, filters, and visuals are designed around real decisions.",
    content:
      "Assessment data becomes more useful when it is translated into a dashboard that supports decisions. A good dashboard highlights the most important indicators, allows users to filter by location or sector, and makes patterns visible without forcing leaders to read long spreadsheets.\n\nBefore building a dashboard, teams should define the decisions it needs to support. This helps avoid unnecessary charts and keeps the interface focused. The dashboard should also use clean data, consistent labels, and visual summaries that are easy to interpret.\n\nAdvance Consultant supports data collection tools, cleaning, analysis, dashboard development, and reporting for projects in humanitarian, government, and private-sector contexts.",
    tags: ["Dashboard", "Data", "Assessment"],
    imageUrl: "/project-images/field-work.png",
  },
  {
    title: "What makes monitoring and evaluation reports more actionable",
    slug: "actionable-monitoring-and-evaluation-reports",
    category: "Research",
    excerpt:
      "Good reports explain what changed, what evidence supports it, and which recommendations teams can implement.",
    content:
      "Monitoring and evaluation reports are most useful when they move beyond description. They should explain what was measured, what changed, what challenges appeared, and what actions should follow.\n\nClear recommendations are important. Each recommendation should be practical, connected to evidence, and written for the people who will implement it. Visuals, tables, and short summaries also help busy teams understand the findings quickly.\n\nAdvance Consultant prepares assessments, baseline studies, endline studies, monitoring reports, and evaluation outputs that help organizations improve programs and communicate results.",
    tags: ["Research", "Monitoring", "Evaluation"],
    imageUrl: "/project-images/ministry.jpg",
  },
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

async function seedBlogs() {
  console.log("Connecting to MongoDB...");
  await connectWithRetry();
  console.log("MongoDB connected. Seeding blogs...");

  for (const blog of blogs) {
    console.log(`Seeding: ${blog.title}`);
    await Blog.findOneAndUpdate(
      { slug: blog.slug },
      {
        ...blog,
        author: "Advance Consultant",
        status: "published",
        publishedAt: new Date(),
      },
      { upsert: true, new: true, runValidators: true, maxTimeMS: 5000 }
    );
  }

  await mongoose.disconnect();
  console.log(`Seeded ${blogs.length} blogs`);
}

seedBlogs().catch(async (error) => {
  console.error("Blog seed failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
