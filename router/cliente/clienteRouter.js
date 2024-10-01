const express = require('express');
const { addCliente } = require('../../controllers/cliente/cliente');


const client = express.Router();


// RUTA POST

client.post("/clientes", addCliente);


module.exports = {
    client
};