import { Router } from "express";
import categoriaController from "../controllers/categoriaController.js";

const router = Router();

router.get("/", categoriaController.getAll);

export default router;
