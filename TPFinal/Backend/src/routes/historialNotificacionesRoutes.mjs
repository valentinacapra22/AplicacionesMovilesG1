import express from "express";
import * as historialController from "../controllers/historialNotificacionesController.mjs";
import {authenticateToken} from "../middleware/authMiddleware.mjs";

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// Obtener historial de notificaciones de un vecindario
router.get("/vecindario/:vecindarioId", historialController.obtenerHistorial);

// Obtener historial filtrado por tipo
router.get("/vecindario/:vecindarioId/tipo/:tipo", historialController.obtenerHistorialPorTipo);

// Obtener estadísticas del historial
router.get("/vecindario/:vecindarioId/estadisticas", historialController.obtenerEstadisticas);

// Buscar notificaciones por texto
router.get("/vecindario/:vecindarioId/buscar", historialController.buscarNotificaciones);

// Obtener notificaciones recientes
router.get("/vecindario/:vecindarioId/recientes", historialController.obtenerNotificacionesRecientes);

// Limpiar historial de un vecindario
router.delete("/vecindario/:vecindarioId", historialController.limpiarHistorial);

// Agregar notificaciones de prueba
router.post("/vecindario/:vecindarioId/prueba", historialController.agregarNotificacionesPrueba);

export default router; 