import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllNotificaciones = async () => {
    return await prisma.notificacion.findMany();
};

export const getNotificacionById = async (id) => {
    return await prisma.notificacion.findUnique({
        where: { notificacionId: parseInt(id) },
    });
};

export const createNotificacion = async (data) => {
    const { titulo, notificacion, contenido, tipo, usuarioId } = data;

    if (!titulo || !notificacion || !contenido || !tipo || !usuarioId) {
        throw new Error('Todos los campos (titulo, notificacion, contenido, tipo, fechaHora, usuarioId) son obligatorios');
    }

    return await prisma.notificacion.create({
        data: {
            titulo,
            notificacion,
            contenido,
            tipo,
            usuarioId: parseInt(usuarioId),
        },
    });
};

export const updateNotificacion = async (id, data) => {
    return await prisma.notificacion.update({
        where: { notificacionId: parseInt(id) },
        data,
    });
};

export const deleteNotificacion = async (id) => {
    return await prisma.notificacion.delete({
        where: { notificacionId: parseInt(id) },
    });
};
