import express from "express";
import { createCategory } from "../controllers/Category.controllers.js";

const router = express.Router();

router.post("/createcategory", createCategory);

export default router;