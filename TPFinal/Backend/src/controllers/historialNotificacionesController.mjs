import * as historialService from "../services/historialNotificacionesService.mjs";
import catchAsync from "../helpers/catchAsync.mjs";

// Obtener historial de notificaciones de un vecindario
export const obtenerHistorial = catchAsync(async (req, res) => {
  const { vecindarioId } = req.params;
  const { limit = 50, offset = 0 } = req.query;

  if (!vecindarioId) {
    return res.status(400).json({ error: "ID de vecindario requerido" });
  }

  try {
    const historial = await historialService.obtenerHistorial(
      vecindarioId, 
      parseInt(limit), 
      parseInt(offset)
    );

    res.status(200).json({
      success: true,
      data: historial,
      total: historial.length,
      vecindarioId: parseInt(vecindarioId)
    });
  } catch (error) {
    console.error("Error obteniendo historial:", error);
    res.status(500).json({ error: "Error al obtener el historial" });
  }
});

// Obtener historial filtrado por tipo
export const obtenerHistorialPorTipo = catchAsync(async (req, res) => {
  const { vecindarioId, tipo } = req.params;
  const { limit = 50 } = req.query;

  if (!vecindarioId || !tipo) {
    return res.status(400).json({ error: "ID de vecindario y tipo requeridos" });
  }

  try {
    const historial = await historialService.obtenerHistorialPorTipo(
      vecindarioId, 
      tipo, 
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      data: historial,
      total: historial.length,
      tipo,
      vecindarioId: parseInt(vecindarioId)
    });
  } catch (error) {
    console.error("Error obteniendo historial por tipo:", error);
    res.status(500).json({ error: "Error al obtener el historial por tipo" });
  }
});

// Obtener estadísticas del historial
export const obtenerEstadisticas = catchAsync(async (req, res) => {
  const { vecindarioId } = req.params;

  if (!vecindarioId) {
    return res.status(400).json({ error: "ID de vecindario requerido" });
  }

  try {
    const estadisticas = await historialService.obtenerEstadisticasHistorial(vecindarioId);

    res.status(200).json({
      success: true,
      data: estadisticas,
      vecindarioId: parseInt(vecindarioId)
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    res.status(500).json({ error: "Error al obtener las estadísticas" });
  }
});

// Limpiar historial de un vecindario
export const limpiarHistorial = catchAsync(async (req, res) => {
  const { vecindarioId } = req.params;

  if (!vecindarioId) {
    return res.status(400).json({ error: "ID de vecindario requerido" });
  }

  try {
    const resultado = await historialService.limpiarHistorial(vecindarioId);

    res.status(200).json({
      success: true,
      message: resultado.mensaje,
      vecindarioId: parseInt(vecindarioId)
    });
  } catch (error) {
    console.error("Error limpiando historial:", error);
    res.status(500).json({ error: "Error al limpiar el historial" });
  }
});

// Buscar notificaciones por texto
export const buscarNotificaciones = catchAsync(async (req, res) => {
  const { vecindarioId } = req.params;
  const { q: query, limit = 20 } = req.query;

  if (!vecindarioId || !query) {
    return res.status(400).json({ error: "ID de vecindario y término de búsqueda requeridos" });
  }

  try {
    const resultados = await historialService.buscarNotificaciones(
      vecindarioId, 
      query, 
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      data: resultados,
      total: resultados.length,
      query,
      vecindarioId: parseInt(vecindarioId)
    });
  } catch (error) {
    console.error("Error buscando notificaciones:", error);
    res.status(500).json({ error: "Error al buscar notificaciones" });
  }
});

// Obtener notificaciones recientes
export const obtenerNotificacionesRecientes = catchAsync(async (req, res) => {
  const { vecindarioId } = req.params;
  const { horas = 24 } = req.query;

  if (!vecindarioId) {
    return res.status(400).json({ error: "ID de vecindario requerido" });
  }

  try {
    const notificaciones = await historialService.obtenerNotificacionesRecientes(
      vecindarioId, 
      parseInt(horas)
    );

    res.status(200).json({
      success: true,
      data: notificaciones,
      total: notificaciones.length,
      horas: parseInt(horas),
      vecindarioId: parseInt(vecindarioId)
    });
  } catch (error) {
    console.error("Error obteniendo notificaciones recientes:", error);
    res.status(500).json({ error: "Error al obtener notificaciones recientes" });
  }
});

// Agregar notificaciones de prueba
export const agregarNotificacionesPrueba = catchAsync(async (req, res) => {
  const { vecindarioId } = req.params;

  if (!vecindarioId) {
    return res.status(400).json({ error: "ID de vecindario requerido" });
  }

  try {
    await historialService.agregarNotificacionesPrueba(vecindarioId);

    res.status(200).json({
      success: true,
      message: "Notificaciones de prueba agregadas exitosamente",
      vecindarioId: parseInt(vecindarioId)
    });
  } catch (error) {
    console.error("Error agregando notificaciones de prueba:", error);
    res.status(500).json({ error: "Error al agregar notificaciones de prueba" });
  }
}); 