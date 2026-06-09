import Publication from "../models/publicactionModel.js";



/*
CREATE PUBLICATION
*/

export const createPublication = async (req, res) => {

try {
const title = req.body.title?.trim();
const description = req.body.description?.trim();
const moreDescription = req.body.moreDescription?.trim();

if (!title || !description || !moreDescription) {
return res.status(400).json({
message: "Title, short description, and full description are required",
});
}

const image = req.uploadedFiles?.image;

const pdf = req.uploadedFiles?.file;



if (!image || !pdf) {

return res.status(400).json({

message: "Image and PDF required",

});

}



const publication = await Publication.create({

title,

description,

moreDescription,

// category: req.body.category,

imageUrl: image.url,

pdfUrl: pdf.url,   // ✅ THIS IS THE FIX

pdfKey: pdf.key,

});



res.status(201).json({

success: true,

data: publication,

});



} catch (error) {

console.log("CREATE PUBLICATION ERROR:", error);



res.status(500).json({

success: false,

message: error.message || "Publication create failed",

});

}

};





/*
GET ALL
*/

export const getPublications = async (req, res) => {

try {

const publications = await Publication.find()

.sort({ createdAt: -1 });



res.json({

success: true,

data: publications,

});



} catch (error) {

res.status(500).json({

message: error.message,

});

}

};






/*
GET SINGLE
*/

export const getPublication = async (req, res) => {

try {

const publication = await Publication.findById(req.params.id);



if (!publication) {

return res.status(404).json({

message: "Publication not found",

});

}



res.json({

success: true,

data: publication,

});



} catch (error) {

res.status(500).json({

message: error.message,

});

}

};







/*
UPDATE
*/



export const updatePublication = async (req, res) => {

try {
const title = req.body.title?.trim();
const description = req.body.description?.trim();
const moreDescription = req.body.moreDescription?.trim();

const old = await Publication.findById(req.params.id);

if (!old) {

return res.status(404).json({

message: "Publication not found",

});

}



/* NEW DATA */

const updatedData = {

title: title || old.title,

description: description || old.description,

moreDescription: moreDescription || old.moreDescription,

imageUrl:

req.uploadedFiles?.image?.url || old.imageUrl,

pdfUrl:

req.uploadedFiles?.file?.url || old.pdfUrl,

pdfKey:

req.uploadedFiles?.file?.key || old.pdfKey,

};



const publication = await Publication.findByIdAndUpdate(

req.params.id,

updatedData,

{ new: true }

);



res.json({

success: true,

data: publication,

});



}

catch (error) {

console.log(error);

res.status(500).json({

message: error.message,

});

}

};









/*
DELETE
*/

export const deletePublication = async (req, res) => {

try {

await Publication.findByIdAndDelete(req.params.id);



res.json({

success: true,

message: "Publication deleted",

});



} catch (error) {

res.status(500).json({

message: error.message,

});

}

};
