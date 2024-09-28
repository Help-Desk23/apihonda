const express = require('express');
const { upload, addMoto, deleteMoto } = require('../../controllers/motos/motos');


const moto = express.Router();


// Ruta POST

moto.post('/motos', upload.single('img_motos'), addMoto);

// Ruta DELETE
/*
moto.delete('/moto/:id_motos', deleteMoto);
*/

module.exports = {
    moto
};