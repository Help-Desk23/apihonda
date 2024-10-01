const {db, sql} = require('../../config/db');

// Controlador GET para obtener clientes

const getClientes = async (socket) => {
    try{
        const pool = await sql.connect(db);
        const result = await pool.request().query('SELECT * FROM cliente');

        if( result.recordset.length === 0){
            return socket.emit('error', { message: "No se encontró ningun cliente"});
        }
        socket.emit('cliente', result.recordset);
    }catch(err){
        console.error("Error al obtener los clientes", err);
        socket.emit('error', { message: "Error al obtener clientes"});
    }
};


module.exports = {
    getClientes
};