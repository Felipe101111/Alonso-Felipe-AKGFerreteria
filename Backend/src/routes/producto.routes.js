import { Router } from "express";
import productoController from "../controllers/productoController.js";
import { authenticate, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", productoController.getAll);
router.get("/:id", productoController.getById);
router.post("/", authenticate, requireAdmin, productoController.create);
router.put("/:id", authenticate, requireAdmin, productoController.update);
router.delete("/:id", authenticate, requireAdmin, productoController.remove);

export default router;
