import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Agregar notificación al historial de un vecindario
export const agregarNotificacion = async (vecindarioId, notificacion) => {
  try {
    const notificacionCompleta = {
      vecindarioId: parseInt(vecindarioId),
      tipo: notificacion.tipo || 'info',
      titulo: notificacion.titulo || null,
      mensaje: notificacion.mensaje,
      emisor: notificacion.emisor || 'Sistema',
      metadata: notificacion.metadata || {}
    };

    const nuevaNotificacion = await prisma.historialNotificacion.create({
      data: notificacionCompleta
    });

    console.log(`📝 Notificación agregada al historial del vecindario ${vecindarioId}`);
    return nuevaNotificacion;
  } catch (error) {
    console.error('❌ Error agregando notificación al historial:', error);
    throw error;
  }
};

// Obtener historial de notificaciones de un vecindario
export const obtenerHistorial = async (vecindarioId, limit = 50, offset = 0) => {
  try {
    console.log(`🔍 Obteniendo historial para vecindario ${vecindarioId}`);
    
    const notificaciones = await prisma.historialNotificacion.findMany({
      where: {
        vecindarioId: parseInt(vecindarioId)
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit,
      skip: offset,
      include: {
        vecindario: {
          select: {
            nombre: true
          }
        }
      }
    });

    console.log(`✅ Historial obtenido: ${notificaciones.length} notificaciones`);
    return notificaciones;
  } catch (error) {
    console.error('❌ Error obteniendo historial:', error);
    throw error;
  }
};

// Obtener historial filtrado por tipo
export const obtenerHistorialPorTipo = async (vecindarioId, tipo, limit = 50) => {
  try {
    const notificaciones = await prisma.historialNotificacion.findMany({
      where: {
        vecindarioId: parseInt(vecindarioId),
        tipo: tipo
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit,
      include: {
        vecindario: {
          select: {
            nombre: true
          }
        }
      }
    });

    return notificaciones;
  } catch (error) {
    console.error('❌ Error obteniendo historial por tipo:', error);
    throw error;
  }
};

// Obtener estadísticas del historial
export const obtenerEstadisticasHistorial = async (vecindarioId) => {
  try {
    const [total, porTipo, ultimaNotificacion] = await Promise.all([
      // Total de notificaciones
      prisma.historialNotificacion.count({
        where: {
          vecindarioId: parseInt(vecindarioId)
        }
      }),
      
      // Contar por tipo
      prisma.historialNotificacion.groupBy({
        by: ['tipo'],
        where: {
          vecindarioId: parseInt(vecindarioId)
        },
        _count: {
          tipo: true
        }
      }),
      
      // Última notificación
      prisma.historialNotificacion.findFirst({
        where: {
          vecindarioId: parseInt(vecindarioId)
        },
        orderBy: {
          timestamp: 'desc'
        }
      })
    ]);

    // Procesar estadísticas por tipo
    const estadisticasPorTipo = {};
    porTipo.forEach(item => {
      estadisticasPorTipo[item.tipo] = item._count.tipo;
    });

    // Obtener estadísticas por día (últimos 30 días)
    const treintaDiasAtras = new Date();
    treintaDiasAtras.setDate(treintaDiasAtras.getDate() - 30);

    const notificacionesPorDia = await prisma.historialNotificacion.findMany({
      where: {
        vecindarioId: parseInt(vecindarioId),
        timestamp: {
          gte: treintaDiasAtras
        }
      },
      select: {
        timestamp: true
      }
    });

    const estadisticasPorDia = {};
    notificacionesPorDia.forEach(notif => {
      const fecha = new Date(notif.timestamp).toDateString();
      estadisticasPorDia[fecha] = (estadisticasPorDia[fecha] || 0) + 1;
    });

    const estadisticas = {
      total,
      porTipo: estadisticasPorTipo,
      porDia: estadisticasPorDia,
      ultimaNotificacion
    };

    return estadisticas;
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas del historial:', error);
    throw error;
  }
};

// Limpiar historial de un vecindario
export const limpiarHistorial = async (vecindarioId) => {
  try {
    await prisma.historialNotificacion.deleteMany({
      where: {
        vecindarioId: parseInt(vecindarioId)
      }
    });

    console.log(`🗑️ Historial limpiado para el vecindario ${vecindarioId}`);
    return { mensaje: 'Historial limpiado exitosamente' };
  } catch (error) {
    console.error('❌ Error limpiando historial:', error);
    throw error;
  }
};

// Buscar notificaciones por texto
export const buscarNotificaciones = async (vecindarioId, texto, limit = 20) => {
  try {
    const notificaciones = await prisma.historialNotificacion.findMany({
      where: {
        vecindarioId: parseInt(vecindarioId),
        OR: [
          {
            mensaje: {
              contains: texto,
              mode: 'insensitive'
            }
          },
          {
            titulo: {
              contains: texto,
              mode: 'insensitive'
            }
          },
          {
            emisor: {
              contains: texto,
              mode: 'insensitive'
            }
          }
        ]
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit,
      include: {
        vecindario: {
          select: {
            nombre: true
          }
        }
      }
    });

    return notificaciones;
  } catch (error) {
    console.error('❌ Error buscando notificaciones:', error);
    throw error;
  }
};

// Obtener notificaciones recientes (últimas 24 horas)
export const obtenerNotificacionesRecientes = async (vecindarioId, horas = 24) => {
  try {
    const tiempoLimite = new Date();
    tiempoLimite.setHours(tiempoLimite.getHours() - horas);

    const notificaciones = await prisma.historialNotificacion.findMany({
      where: {
        vecindarioId: parseInt(vecindarioId),
        timestamp: {
          gte: tiempoLimite
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      include: {
        vecindario: {
          select: {
            nombre: true
          }
        }
      }
    });

    return notificaciones;
  } catch (error) {
    console.error('❌ Error obteniendo notificaciones recientes:', error);
    throw error;
  }
};

// Función para agregar notificaciones de prueba
export const agregarNotificacionesPrueba = async (vecindarioId) => {
  try {
    const notificacionesPrueba = [
      {
        tipo: 'alarma',
        titulo: 'Alarma de Seguridad',
        mensaje: 'Se detectó movimiento sospechoso en la entrada principal',
        emisor: 'Sistema de Seguridad',
        metadata: { ubicacion: 'Entrada Principal', nivel: 'alto' }
      },
      {
        tipo: 'info',
        titulo: 'Mantenimiento Programado',
        mensaje: 'El próximo martes se realizará mantenimiento en el sistema de agua',
        emisor: 'Administración',
        metadata: { fecha: '2024-01-15', duracion: '2 horas' }
      },
      {
        tipo: 'success',
        titulo: 'Vecino Registrado',
        mensaje: 'Bienvenido al vecindario! Tu cuenta ha sido activada exitosamente',
        emisor: 'Sistema',
        metadata: { accion: 'registro_exitoso' }
      },
      {
        tipo: 'warning',
        titulo: 'Corte de Energía',
        mensaje: 'Se programó un corte de energía para mañana de 2:00 a 4:00 AM',
        emisor: 'Servicios Públicos',
        metadata: { inicio: '02:00', fin: '04:00', fecha: '2024-01-16' }
      }
    ];

    for (const notif of notificacionesPrueba) {
      await agregarNotificacion(vecindarioId, notif);
    }

    console.log(`✅ Notificaciones de prueba agregadas al vecindario ${vecindarioId}`);
    return true;
  } catch (error) {
    console.error('❌ Error agregando notificaciones de prueba:', error);
    throw error;
  }
}; 