//    // admin login
// router.post("/createAdmin", createAdmin);
// router.post("/customerLogin", AminLogin);

import express from "express";
import {
  loginUser,
  registerUser,
} from "../controlls/userCntrol.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser); // optional

export default router;
