import express from "express";
import authController from "./auth.controllers.js";
const router = express.Router();

router.post("/sign-up", authController.createPractitioner);
router.post("/login", authController.loginPractitioner);

export default router;
