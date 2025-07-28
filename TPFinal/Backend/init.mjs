import http from 'http';
import app from './src/app.mjs';
import { Server } from 'socket.io'; 

const server = http.createServer(app); 
const io = new Server(server);  

const connectedClients = new Map(); 
io.on('connection', (socket) => {
  console.log(`🔌 Usuario conectado: ${socket.id}`);
  connectedClients.set(socket.id, { id: socket.id });
  io.emit('update-clients', Array.from(connectedClients.values()));
  socket.on('unirseAlVecindario', (message) => {
    console.log(`📩 Mensaje recibido: ${message}`);
    socket.join(message);
    const rooms = Array.from(socket.rooms);
    console.log("aaa", rooms);
  });

  socket.on('enviarNotificacion', ({ sala, mensaje }) => {
    console.log(`📢 Enviando notificación a la sala ${sala}: ${mensaje}`);
    io.to(sala).emit('notificacion', mensaje);
  });


  socket.on("nuevaAlarma", (message) => {
    console.log(`📩 Mensaje recibido: ${message}`);
    socket.join(message);
  }
  );

  socket.on('disconnect', () => {
    console.log(`❌ Usuario desconectado: ${socket.id}`);
    connectedClients.delete(socket.id);
    io.emit('update-clients', Array.from(connectedClients.values()));
  });

  socket.on('get-clients', () => {
    socket.emit('update-clients', Array.from(connectedClients.values()));
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
