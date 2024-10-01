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
        const {nombre, telefono, plazo, precious, inicialbs, cuota_mes, id_motos, id_asesores, id_sucursal} = req.body;

        const pool = await sql.connect(db);
        const result = await pool.request()
        .input('nombre', sql.VarChar, nombre)
        .input('telefono', sql.Int, telefono)
        .input('plazo', sql.Int, plazo)
        .input('precious', sql.VarChar, precious)
        .input('inicialbs', sql.VarChar, inicialbs)
        .input('fecha', sql.Date, new Date())
        .input('cuota_mes', sql.Decimal(5,2), cuota_mes)
        .input('id_motos', sql.Int, id_motos)
        .input('id_asesores', sql.Int, id_asesores)
        .input('id_sucursal', sql.Int, id_sucursal)
        .query(` INSERT INTO cliente (nombre, telefono, plazo, precious, inicialbs, fecha, cuota_mes, id_motos, id_asesores, id_sucursal) 
            VALUES (@nombre, @telefono, @plazo, @precious, @inicialbs, @fecha, @cuota_mes, @id_motos, @id_asesores, @id_sucursal)`);

            res.status(201).json({message: 'Cliente agregado correctamente'})
    } catch(err) {
        console.error('Error al agregar cliente', err);
        res.status(500).json({ error: 'Error al agregar cliente'});
    }
};


// Controlador GET para mostrar Cliente Completos

const getCliente = async (socket) => {
    try {
        const pool = await sql.connect(db);
        
        const result = await pool.request()
            .query(`
                SELECT 
                    c.id_cliente,
                    c.nombre AS nombre_cliente,
                    c.telefono,
                    c.plazo,
                    c.precious,
                    c.inicialbs,
                    c.fecha,
                    c.cuota_mes,
                    m.modelo AS modelo,
                    a.nombre AS asesor,
                    s.sucursal AS sucursal,
                    m.img_motos AS img_moto
                FROM 
                    cliente c
                JOIN 
                    motos m ON c.id_motos = m.id_motos
                JOIN 
                    asesores a ON c.id_asesores = a.id_asesores
                JOIN 
                    sucursales s ON c.id_sucursal = s.id_sucursal
            `);

        if (result.recordset.length === 0) {
            return socket.emit( 'error', { message: 'No se encontraron registros' });
        }

        socket.emit('clienteData', result.recordset);
        
    } catch (err) {
        console.error('Error al obtener el reporte de cliente:', err);
        socket.emit('error', { message: 'Error al obtener el reporte de cliente' });
    }
};


module.exports = {
    getClientes,
    addCliente,
    getCliente
};




