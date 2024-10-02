const express = require('express');
const { addProforma } = require('../../controllers/proforma/proforma');


const proform = express.Router();

// Ruta POST

proform.post("/proforma", addProforma);


module.exports = { proform };