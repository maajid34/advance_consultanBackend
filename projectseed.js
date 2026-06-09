import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import slugify from "slugify";
import Project from "./models/projectModels.js";
import Category from "./models/Category.js";

const projects = [
  {
    title: "Topographic study in 2MW project - Kismayo",
    date: "2025",
    client: "GSI",
    location: "Kismayo",
    description:
      "This assignment supported the early technical planning of a 2MW energy project in Kismayo through a focused topographic study of the proposed site. The work helped document ground conditions, site features, access points, and spatial constraints that could affect design and implementation. The resulting information provides an important foundation for engineers, planners, and project stakeholders to make informed decisions before moving into detailed design and construction preparation.",
    activities: [
      "Conducted site reconnaissance and ground control planning.",
      "Collected topographic survey data for the 2MW project area.",
      "Prepared mapping outputs to support engineering design decisions.",
    ],
    images: ["/project-images/field-work.png", "/project-images/greenvolt.png"],
  },
  {
    title: "Feasibility study of 2MW project - Kismayo",
    date: "2025",
    client: "GSI",
    location: "Kismayo",
    description:
      "The feasibility study reviewed the practical requirements for developing a 2MW project in Kismayo, including site readiness, technical options, operational considerations, and implementation risks. The assignment helped clarify whether the proposed project could be delivered efficiently and sustainably within the local context. Findings from the study were prepared to support planning, budgeting, stakeholder discussion, and the next stages of project development.",
    activities: [
      "Reviewed technical, operational, and site conditions for project viability.",
      "Assessed implementation options for the proposed 2MW system.",
      "Prepared feasibility findings to guide investment and planning.",
    ],
    images: ["/project-images/greenvolt.png", "/project-images/field-work.png"],
  },
  {
    title: "Hayaat Logistics website",
    date: "2025",
    client: "Hayaat Logistics",
    websiteUrl: "https://hayaat-logistic.vercel.app/",
    description:
      "The Hayaat Logistics website project focused on building a clear and professional digital presence for a logistics service provider. The website was structured to present company services, improve customer confidence, and make it easier for potential clients to understand the organization’s capacity. The work included responsive page layouts, service-focused content organization, and a user experience suitable for visitors browsing from both mobile and desktop devices.",
    activities: [
      "Designed and developed a responsive logistics company website.",
      "Structured service pages for transport, logistics, and client enquiries.",
      "Optimized the website layout for mobile and desktop users.",
    ],
    images: ["/project-images/hayaat.jpg", "/project-images/consulting-team.png"],
  },
  {
    title: "Keystone Consultant website",
    date: "2025",
    client: "GSI",
    websiteUrl: "https://keystone-consultant.com/",
    description:
      "The Keystone Consultant website was developed to present consulting services, organizational profile, and project experience in a polished online format. The project focused on clarity, credibility, and easy navigation so that visitors can quickly understand what the organization offers. The website structure supports service presentation, institutional visibility, and stronger communication with partners and clients.",
    activities: [
      "Built a professional consulting website for service presentation.",
      "Created a clear content structure for projects and organizational profile.",
      "Improved visual branding and navigation for client discovery.",
    ],
    images: ["/project-images/keystone.jpg", "/project-images/consulting-team.png"],
  },
  {
    title: "Aqoonmaal Construction & Transport website",
    date: "2025",
    client: "Aqoonmaal",
    websiteUrl: "https://aqoonmaal.com/",
    description:
      "This website project supported Aqoonmaal Construction & Transport by creating an online platform for presenting its construction, transport, and business service capabilities. The work emphasized a simple content structure, responsive design, and clear service communication. The website helps the company improve visibility, share its profile with potential clients, and provide a more professional first point of contact online.",
    activities: [
      "Developed a company website for construction and transport services.",
      "Organized business information into readable service sections.",
      "Prepared a responsive interface for public users and potential clients.",
    ],
    images: ["/project-images/consulting-team.png", "/project-images/field-work.png"],
  },
  {
    title: "Sundus Ltd website",
    date: "2025",
    client: "Sundus",
    websiteUrl: "https://sundus.ltd/",
    description:
      "The Sundus Ltd website was designed to give the company a modern and accessible online presence. The project organized business information into clean sections that communicate services, identity, and contact pathways. The final structure supports mobile users, improves public visibility, and gives the company a professional platform for introducing itself to customers and partners.",
    activities: [
      "Designed a modern company website for Sundus Ltd.",
      "Presented company services and contact pathways in a clean layout.",
      "Implemented responsive pages for mobile-first browsing.",
    ],
    images: ["/project-images/sundus.jpg", "/project-images/consulting-team.png"],
  },
  {
    title: "Haaran Org website",
    date: "2024",
    client: "HOAARN",
    websiteUrl: "https://haaransom.org/",
    description:
      "The Haaran Org website project helped the organization present its work, programs, and public information through a structured digital platform. The website was planned for accessibility, outreach, and partner communication. It provides a stronger online identity for the organization and creates a clearer way for communities, stakeholders, and supporters to learn about its activities.",
    activities: [
      "Created an organization website to present programs and public information.",
      "Structured pages for visibility, communication, and outreach.",
      "Prepared a responsive design suitable for community and partner audiences.",
    ],
    images: ["/project-images/consulting-team.png", "/project-images/field-work.png"],
  },
  {
    title: "WASH Assessment Dashboard",
    date: "2023",
    client: "MoEWR Jubaland",
    location: "Jubaland",
    description:
      "The WASH Assessment Dashboard was developed to support the presentation and interpretation of water, sanitation, and hygiene assessment information. The dashboard helps organize field data into useful summaries that can support planning, reporting, and decision-making. By turning assessment results into a more visual and accessible format, the project strengthened the ability of stakeholders to understand needs, track conditions, and prioritize interventions.",
    activities: [
      "Developed a dashboard for WASH assessment information.",
      "Organized field data into visual summaries for decision-makers.",
      "Supported reporting workflows for water and sanitation planning.",
    ],
    images: ["/project-images/ministry.jpg", "/project-images/field-work.png"],
  },
  {
    title: "El Nino Impact Assessment",
    date: "2023",
    client: "MoEWR Jubaland",
    location: "Jubaland",
    description:
      "The El Nino Impact Assessment focused on understanding the effects of El Nino related conditions on communities, services, and local response priorities. The project supported evidence-based planning by gathering and organizing assessment findings for government and stakeholder use. Its outputs help inform coordination, preparedness, and response decisions in areas affected by climate-related shocks.",
    activities: [
      "Assessed El Nino related impacts affecting communities and services.",
      "Compiled findings to support planning and response coordination.",
      "Prepared assessment outputs for government and stakeholder review.",
    ],
    images: ["/project-images/ministry.jpg", "/project-images/greenvolt.png"],
  },
];

const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
};

if (process.env.MONGO_TLS_ALLOW_INVALID_CERTS === "true") {
  mongoOptions.tlsAllowInvalidCertificates = true;
}

const makeDescription = (project) => project.description;

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

async function seedProjects() {
  console.log("Connecting to MongoDB...");
  await connectWithRetry();
  console.log("MongoDB connected. Seeding projects...");

  const websiteCategory = await Category.findOneAndUpdate(
    { slug: "website" },
    { name: "Website", slug: "website" },
    { upsert: true, new: true, runValidators: true, maxTimeMS: 5000 }
  );

  for (const project of projects) {
    const slug = slugify(project.title, { lower: true });
    const isWebsiteProject = Boolean(project.websiteUrl);
    console.log(`Seeding: ${project.title}`);

    await Project.findOneAndUpdate(
      { slug },
      {
        ...project,
        slug,
        description: makeDescription(project),
        activities: project.activities,
        image: project.images[0],
        images: project.images,
        websiteUrl: project.websiteUrl || "",
        category: isWebsiteProject ? websiteCategory._id : undefined,
      },
      { upsert: true, new: true, runValidators: true, maxTimeMS: 5000 }
    );
  }

  await mongoose.disconnect();
  console.log(`Seeded ${projects.length} projects`);
}

seedProjects().catch(async (error) => {
  console.error("Project seed failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
