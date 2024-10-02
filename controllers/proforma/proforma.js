const {db, sql} = require('../../config/db');

// Controlador GET para obtener las proformas

const getProformas = async (socket) => {
    try{
        const pool = await sql.connect(db);
        const result = await pool.request().query('SELECT * FROM proforma');

        if( result.recordset.length === 0){
            return socket.emit('error', { message: "No se encontró ninguna proforma"});
        }
        socket.emit('proforma', result.recordset);
    }catch(err){
        console.error("Error al obtener las proformas", err);
        socket.emit('error', { message: "Error al obtener las proformas"});
    }
};


// Controlador POST para agregar proforma

const addProforma = async(req, res) => {
    try{
        const {id_cliente, id_motos, id_asesores, id_sucursal, plazo, precious, inicialbs, cuota_mes} = req.body;

        const pool = await sql.connect(db);
        const result = await pool.request()
        .input('id_cliente', sql.Int, id_cliente)
        .input('id_motos', sql.Int, id_motos)
        .input('id_asesores', sql.Int, id_asesores)
        .input('id_sucursal', sql.Int, id_sucursal)
        .input('plazo', sql.Int, plazo)
        .input('precious', sql.VarChar, precious)
        .input('inicialbs', sql.VarChar, inicialbs)
        .input('fecha', sql.Date, new Date())
        .input('cuota_mes', sql.Decimal(5,2), cuota_mes)
        .query(`INSERT INTO proforma (id_cliente, id_motos, id_asesores, id_sucursal, plazo, precious, inicialbs, fecha, cuota_mes) 
            VALUES (@id_cliente, @id_motos, @id_asesores, @id_sucursal, @plazo, @precious, @inicialbs, @fecha, @cuota_mes)`);

            res.status(201).json({message: 'Proforma agregada correctamente'})
    } catch(err) {
        console.error('Error al agregar proforma', err);
        res.status(500).json({ error: 'Error al agregar proforma'});
    }
};


// Controlador GET para mostrar Cliente Completos

const getCotizacion = async (socket) => {
    try {
        const pool = await sql.connect(db);
        
        const result = await pool.request()
            .query(`
                SELECT 
                    c.id_cliente,
                    c.nombre AS nombre_cliente,
                    c.telefono,
                    p.plazo,
                    p.precious,
                    p.inicialbs,
                    p.fecha,
                    p.cuota_mes,
                    m.modelo AS modelo,
                    a.nombre AS asesor,
                    s.sucursal AS sucursal,
                    m.img_motos AS img_moto
                FROM 
                    cliente c
                JOIN 
                    proforma p ON c.id_cliente = p.id_cliente
                JOIN 
                    motos m ON p.id_motos = m.id_motos
                JOIN 
                    asesores a ON p.id_asesores = a.id_asesores
                JOIN 
                    sucursales s ON p.id_sucursal = s.id_sucursal
            `);

        if (result.recordset.length === 0) {
            return socket.emit( 'error', { message: 'No se encontraron registros' });
        }

        socket.emit('proformaData', result.recordset);
        
    } catch (err) {
        console.error('Error al obtener cotización:', err);
        socket.emit('error', { message: 'Error al obtener la cotización' });
    }
};


module.exports = {
    getProformas,
    addProforma,
    getCotizacion
};

/*


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
*/