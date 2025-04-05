const {db, sql} = require('../../config/db');
const multer = require('multer');
const path = require('path');


// Configuración de multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// Controlador GET para obtener las motos

const getMotos = async (socket) => {
    try {
        const pool = await sql.connect(db);
        const result = await pool.request().query('SELECT * FROM motos');
        console.log('Consulta ejecutada, resultados:', result.recordset);

        if (result.recordset.length === 0) {
            return socket.emit('error', { message: 'No se encontró ninguna moto' });
        }
        socket.emit('motos', result.recordset); 
    } catch (err) {
        console.error("Error al obtener motos", err);
        socket.emit('error', { message: "Error al obtener motos" });
    }
};


// Controlador POST para agregar motos

const addMoto = async (req, res) => {
    const { modelo, precious, inicialbs } = req.body;

    const port = req.get('host').split(':')[1];
    const img_motos = req.file ? `http://192.168.2.62:${port}/uploads/${req.file.filename}` : null;

    try{
        const pool = await sql.connect(db);
        const result = await pool.request()
            .input('modelo', sql.VarChar, modelo)
            .input('precious', sql.VarChar, precious)
            .input('inicialbs', sql.VarChar, inicialbs)
            .input('img_motos', sql.VarChar, img_motos)
            .query('INSERT INTO motos (modelo, precious, inicialbs, img_motos) VALUES (@modelo, @precious, @inicialbs, @img_motos)');
        res.status(201).json({message: "Moto añadida exitosamente"});

    }catch(err){
        console.error("Error al añadir la moto:", err);
        res.status(500).json({error: "Error al añadir la moto"});
    }
};

// Controlador DELETE


const deleteMoto = async (socket, data) => {
    const { id_motos } = data; 
    try {
        const pool = await sql.connect(db);

        const result = await pool.request()
            .input('id_motos', sql.Int, id_motos)
            .query('SELECT * FROM motos WHERE id_motos = @id_motos');

        if (result.recordset.length === 0) {
            return socket.emit('error', { message: 'Moto no encontrada' });
        }

        await pool.request()
            .input('id_motos', sql.Int, id_motos)
            .query('DELETE FROM motos WHERE id_motos = @id_motos');

        socket.emit('motoEliminada', { message: 'Moto eliminada exitosamente' });

    } catch (err) {
        console.error("Error al eliminar la moto:", err);
        socket.emit('error', { message: 'Error al eliminar la moto' });
    }
};


module.exports = {
    getMotos,
    addMoto,
    deleteMoto,
    upload
};