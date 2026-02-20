import express from "express";

import {

createPublication,
getPublications,
deletePublication,
updatePublication,
getPublication,

} from "../controlls/publicationController.js";

import {

uploadDoc,
uploadToR2,

} from "../middleware/uploadDoc.js";


const router = express.Router();




router.post(

"/",

uploadDoc,
uploadToR2,

createPublication

);




router.get("/", getPublications);

router.get("/:id", getPublication);

router.delete("/:id", deletePublication);

// router.put("/:id", updatePublication);
router.put(
"/:id",
uploadDoc,
uploadToR2,
updatePublication
);




export default router;
