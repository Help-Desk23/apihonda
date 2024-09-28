const io = require('socket.io-client'); 
const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('Conectado al servidor WebSocket');
    socket.emit('obtenerMotos');
});

socket.on('motos', (data) => {
    console.log('Motos recibidas:', data);
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor WebSocket');
});