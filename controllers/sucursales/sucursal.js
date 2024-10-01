const {db, sql} = require('../../config/db');

// Controlador GET para obtener sucursales

const getSucursales = async (socket) => {
    try{
        const pool = await sql.connect(db);
        const result = await pool.request().query('SELECT * FROM sucursales');

        if( result.recordset.length === 0){
            return socket.emit('error', {message: "No se encontro ninguna sucursal"});
        }
        socket.emit('sucursales', result.recordset);
    }catch(err){
        console.error("Error al obtener las sucursales");
        socket.emit('error', { message: "Error al obtener las sucursales"});
    }
};

// Controlador POST para agregar sucursales

const addSucursal = async(req, res) => {
    const { sucursal } = req.body;

    try{
        const pool = await sql.connect(db);

        const result = await pool.request()
        .input('sucursal', sql.VarChar, sucursal)
        .query('INSERT INTO sucursales (sucursal) VALUES (@sucursal)');

        res.status(201).json({ message: 'Sucursal ingresada correctamente'});
    } catch(err){
        console.error("Error al ingresar una sucursal");
        res.status(500).json({error: "Error al ingresar una sucursal"});
    }
};



module.exports = {
    getSucursales,
    addSucursal
};