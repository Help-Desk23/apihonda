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


// Controlador POST para agregar clientes

const addCliente = async(req, res) => {
    try{
        const {nombre, telefono} = req.body;

        if (!nombre || !telefono) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const pool = await sql.connect(db);
        const result = await pool.request()
        .input('nombre', sql.VarChar, nombre)
        .input('telefono', sql.Int, telefono)
        .query(` INSERT INTO cliente (nombre, telefono) 
            VALUES (@nombre, @telefono`);

            res.status(201).json({message: 'Cliente agregado correctamente'})
    } catch(err) {
        console.error('Error al agregar cliente', err);
        res.status(500).json({ error: 'Error al agregar cliente'});
    }
};

// Controlador GET para buscar clientes


const searchCliente = async (req, res) => {
    try {
        const { nombre, telefono } = req.query;

        if (!nombre && !telefono) {
            return res.status(400).json({ error: 'Se debe proporcionar al menos el parámetro "nombre" o "telefono"' });
        }

        const pool = await sql.connect(db);
        const request = pool.request();

        let query = `SELECT * FROM cliente WHERE `;
        const conditions = [];

        if (nombre) {
            conditions.push(`nombre LIKE @nombre`);
            request.input('nombre', sql.VarChar, `%${nombre}%`);
        }

        if (telefono) {
            conditions.push(`telefono = @telefono`);
            request.input('telefono', sql.Int, telefono);
        }

        query += conditions.join(' OR ');

        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No se encontraron clientes" });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error al buscar cliente por nombre o teléfono", err);
        res.status(500).json({ error: "Error en el servidor al buscar cliente" });
    }
};


module.exports = {
    getClientes,
    addCliente,
    searchCliente
};




