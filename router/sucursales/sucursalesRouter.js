const express = require("express");
const { addSucursal } = require("../../controllers/sucursales/sucursal");

const sucursal = express.Router();

// Ruta POST

sucursal.post("/sucursal", addSucursal);


module.exports = { sucursal };