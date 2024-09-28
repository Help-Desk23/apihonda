const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const {db, sql} = require('./config/db');
const { getMotos, addMoto, deleteMoto } = require('./controllers/motos/motos');
const { moto } = require('./router/motos/motoRouter');


const app = express();
app.use(express.json());
require('dotenv').config();

sql.connect(db)
    .then(() => {
        console.log("Conexión con la base de datos exitosa")
    })
    .catch(err => {
        console.error("Error al conectar la base de datos")
    });

// Web Socket

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);


    socket.on('obtenerMotos', () => {
        getMotos(socket);
    });

    socket.on('eliminarMoto', (data) =>{
        deleteMoto(socket, data);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});


// Motos

app.use("/", moto);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});