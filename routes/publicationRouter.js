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

import { adminOnly, protect } from "../middleware/Auth.js";


const router = express.Router();




router.post(

"/",

protect,
adminOnly,
uploadDoc,
uploadToR2,

createPublication

);




router.get("/", getPublications);

router.get("/:id", getPublication);

router.delete("/:id", protect, adminOnly, deletePublication);

// router.put("/:id", updatePublication);
router.put(
"/:id",
protect,
adminOnly,
uploadDoc,
uploadToR2,
updatePublication
);




export default router;
