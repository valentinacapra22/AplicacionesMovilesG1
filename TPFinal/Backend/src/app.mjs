import express from "express";
import vecindarioRoutes from "./routes/vecindarioRoutes.mjs";
import alarmaRoutes from "./routes/alarmaRoutes.mjs";
import usuarioRoutes from "./routes/usuarioRoutes.mjs";
import notificacionRoutes from "./routes/notificacionRoutes.mjs";
import enumGeoNamesRoutes from "./routes/enumGeoNamesRoutes.mjs";
import authRoutes from "./routes/authRoutes.mjs"; 
import morgan from "morgan";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler.mjs";
import ubicacionRoutes from "./routes/ubicacionRoutes.mjs";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:8081", "http://localhost:3001"], 
    credentials: true, 
  })
);

app.get("/", (_req, res) => {
  res.status(200).send("Bienvenido a la API de VegiNet");
});

app.use("/api/auth", authRoutes); 
app.use("/api/vecindarios", vecindarioRoutes);
app.use("/api/alarmas", alarmaRoutes);
app.use("/api/notificaciones", notificacionRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/enumGeoNames", enumGeoNamesRoutes);
app.use("/api/ubicaciones", ubicacionRoutes);
app.use(globalErrorHandler);

export default app;
