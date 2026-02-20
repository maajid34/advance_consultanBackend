import mongoose from "mongoose";

const publicationSchema = new mongoose.Schema(
{
title: {
type: String,
required: true,
},

description: {
type: String,
required: true,
},

moreDescription: {
type: String,
required: true,
},

imageUrl: {
type: String,
required: true,
},

pdfUrl: {
type: String,
required: true,
},

pdfKey: {
type: String,
},

// category: {
// type: String,
// required: true,
// },

},
{
timestamps: true,
}
);

export default mongoose.model("Publications", publicationSchema);
