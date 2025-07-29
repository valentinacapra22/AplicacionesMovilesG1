import express from "express";
import * as alarmaController from "../controllers/alarmaController.mjs";

const router = express.Router();

// Ruta para estadísticas por vecindario (debe ir antes de /:id)
router.get("/estadisticas/:vecindarioId", alarmaController.getEstadisticasVecindario);

router
  .route("/")
  .get(alarmaController.getAllAlarmas)
  .post(alarmaController.createAlarma);

router
  .route("/:id")
  .get(alarmaController.updateAlarma)
  .delete(alarmaController.deleteAlarma);

export default router;

