const io = require('socket.io-client'); 
const socket = io('http://localhost:4000');

socket.on('connect', () => {
    console.log('Conectado al servidor WebSocket');
    socket.emit('obtenerCotizacion');
});

socket.on('proformaData', (data) => {
    console.log('Clientes Recibidos:', data);
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor WebSocket');
});