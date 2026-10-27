import { Router } from "express";
import pedidoController from "../controllers/pedidoController.js";
import { authenticate, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.get("/", requireAdmin, pedidoController.getAll);
router.get("/cliente/:clienteId", pedidoController.getByCliente);
router.post("/", pedidoController.create);
router.patch("/:id/estado", requireAdmin, pedidoController.cambiarEstado);
router.patch("/:id/cancelar", pedidoController.cancelar);

export default router;
