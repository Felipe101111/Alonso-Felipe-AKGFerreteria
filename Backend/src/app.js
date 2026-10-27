import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productoRoutes from "./routes/producto.routes.js";
import categoriaRoutes from "./routes/categoria.routes.js";
import pedidoRoutes from "./routes/pedido.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import errorResponse from "./responses/errorResponse.js";
import { FRONTEND_ORIGIN } from "./utils/config.js";

const app = express();

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/productos", productoRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/pedidos", pedidoRoutes);

app.use((req, res) => errorResponse(res, "La ruta solicitada no existe.", 404));
app.use(errorHandler);

export default app;
