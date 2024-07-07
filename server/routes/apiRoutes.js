import express from "express";
import validateEmailController from "../controllers/validateEmailController.js";

const router = express.Router();

router.post("/validateEmail", validateEmailController);

export default router;
