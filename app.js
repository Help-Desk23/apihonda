const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const {db, sql} = require('./config/db');
const { getMotos, addMoto, deleteMoto } = require('./controllers/motos/motos');
const { moto } = require('./router/motos/motoRouter');
const { getClientes, getCliente } = require('./controllers/cliente/cliente');
const { client } = require('./router/cliente/clienteRouter');
const { getSucursales } = require('./controllers/sucursales/sucursal');
const { sucursal } = require('./router/sucursales/sucursalesRouter');
const { getAsesores } = require('./controllers/asesor/asesor');
const { getCosto } = require('./controllers/costovarios/costo');
const { costo } = require('./router/costovarios/costoRouter');
const { asesores } = require('./router/asesor/asesorRouter');
const { getProformas, getCotizacion } = require('./controllers/proforma/proforma');
const { proform } = require('./router/proforma/proformaRouter');


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

// Motos

    socket.on('obtenerMotos', () => {
        getMotos(socket);
    });

    socket.on('eliminarMoto', (data) =>{
        deleteMoto(socket, data);
    });


// Clientes

    socket.on('obtenerClientes', () => {
        getClientes(socket);
    });

// Sucursales

    socket.on('obtenerSucursales', () => {
        getSucursales(socket);
    });

// Asesores

    socket.on('obtenerAsesores', () => {
        getAsesores(socket);
    });

// Interes Anual y Formulario

    socket.on('obtenerCostos', () => {
        getCosto(socket);
    });

// Proformas

    socket.on('obtenerProforma', () => {
        getProformas(socket);
    });

    socket.on('obtenerCotizacion', () =>{
        getCotizacion(socket);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Ruta Inicial

app.get("/", (req, res) => {
    res.json({message: "Welcome!"});
});

// Motos

app.use("/", moto);

// Clientes

app.use("/", client);

// Sucursal

app.use("/", sucursal);

// Asesores

app.use("/", asesores);

// Costo Varios

app.use("/", costo);

// Proforma

app.use("/", proform);

// Ruta Muestra Imagenes de Motos


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});