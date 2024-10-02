const express = require('express');
const { addCosto, updateCosto } = require('../../controllers/costovarios/costo');

const costo = express.Router();


// Ruta POST

costo.post("/costo", addCosto);

// Ruta PUT

costo.put("/costo/:id", updateCosto);


module.exports = { costo };