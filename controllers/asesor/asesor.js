const {db, sql} = require('../../config/db');

// Controlador GET para obtener asesores

const getAsesores = async (socket) => {
    try{
        const pool = await sql.connect(db);
        const result = await pool.request().query('SELECT * FROM asesores');

        if(result.recordset.length === 0){
            return socket.emit('error', {message: "No se encontro ningun asesor"});
        }
        socket.emit('asesores', result.recordset);
    }catch(err){
        console.err("Error al obtener asesor", err);
        socket.emit('error', { message: "Error al obtener asesor"});
    }
};


module.exports = {
    getAsesores
};