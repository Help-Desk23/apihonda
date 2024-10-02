const {db, sql} = require('../../config/db');


// Controlador GET para obtener Costo Varios

const getCosto = async (socket) => {
    try{
        const pool = await sql.connect(db);
        const result = await pool.request().query('SELECT * FROM costovarios');

        if( result.recordset.length === 0 ){
            return socket.emit('error', { message: "No se encontro Interes Anual y Costo Formulario"});
        }
        socket.emit('costovarios', result.recordset);
    }catch(err){
        console.error("Error al obtener Interes Anual y Formulario");
        socket.emit('error', {message: "Error al obtener Interes Anual y Formulario"});
    }
};

// Controlador POST para ingresar costos

const addCosto = async (req, res) => {
    try {
        const { interes_anual, formulario } = req.body;

        if (interes_anual === undefined || formulario === undefined) {
            return res.status(400).json({ error: 'Por favor, provea todos los campos necesarios' });
        }

        const pool = await sql.connect(db);
        const result = await pool.request()
            .input('interes_anual', sql.Decimal(5, 2), interes_anual)
            .input('formulario', sql.Int, formulario)
            .input('fecha_actualizacion', sql.Date, new Date())
            .query(`
                INSERT INTO costovarios (interes_anual, formulario, fecha_actualizacion) 
                VALUES (@interes_anual, @formulario, @fecha_actualizacion)
            `);

        res.status(201).json({ message: 'Costo varios agregado exitosamente' });
    } catch (err) {
        console.error('Error al agregar costo varios', err);
        res.status(500).json({ error: 'Error al agregar costo varios' });
    }
};


const updateCosto = async (req, res) => {
    try {
        const { id } = req.params;
        const { interes_anual, formulario } = req.body;

        if (id === undefined || interes_anual === undefined || formulario === undefined) {
            return res.status(400).json({ error: 'Por favor, provea todos los campos necesarios' });
        }

        // Conexión a la base de datos
        const pool = await sql.connect(db);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('interes_anual', sql.Decimal(5, 2), interes_anual)
            .input('formulario', sql.Int, formulario)
            .input('fecha_actualizacion', sql.Date, new Date())
            .query(`
                UPDATE costovarios 
                SET interes_anual = @interes_anual, 
                    formulario = @formulario, 
                    fecha_actualizacion = @fecha_actualizacion
                WHERE id = @id
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'No se encontró ningún registro con ese ID' });
        }

        res.status(200).json({ message: 'Costo varios actualizado exitosamente' });
    } catch (err) {
        console.error('Error al actualizar costo varios', err);
        res.status(500).json({ error: 'Error al actualizar costo varios' });
    }
};



module.exports = {
    getCosto,
    addCosto,
    updateCosto
};