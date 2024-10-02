const express = require('express');
const { addCliente, searchCliente } = require('../../controllers/cliente/cliente');


const client = express.Router();


// RUTA POST

client.post("/clientes", addCliente);

// RUTA GET Search

client.post("/clientes/buscar", searchCliente);


module.exports = {
    client
};