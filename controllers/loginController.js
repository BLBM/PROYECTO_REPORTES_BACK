const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Importa bcrypt para hashear y comparar contraseñas
const client = require('../db');
require('dotenv').config();


// Usa la variable de entorno para la clave secreta del JWT
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Ajusta la consulta a tu estructura de usuarios en la base de datos
        const query = 'SELECT * FROM users WHERE username = $1'; // Solo consulta por username
        const result = await client.query(query, [username]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            // Compara la contraseña hasheada en la base de datos con la proporcionada por el usuario
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (isMatch) {
                // Genera el token JWT con el username
                const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
                
                // Devuelve el token al cliente
                res.json({ token });
            } else {
                res.status(401).json({ message: 'Credenciales inválidas' });
            }
        } else {
            res.status(401).json({ message: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
