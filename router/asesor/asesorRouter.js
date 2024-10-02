const express = require('express');
const { addAsesores, loginAsesores } = require('../../controllers/asesor/asesor');

const asesores = express.Router();

// Ruta POST

asesores.post("/asesores", addAsesores);

// Ruta POST LOGIN

asesores.post("/login", loginAsesores);



module.exports = {
    asesores
};