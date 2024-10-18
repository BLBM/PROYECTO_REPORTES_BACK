const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


const authMiddleware = (req, res, next) => {
    
    const token = req.headers['authorization']?.split(' ')[1]; // Obtén el token sin el 'Bearer '
   // console.log(token);
   // console.log('JWT_SECRET:', JWT_SECRET);
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
           // console.log(user)
            //console.log(err);
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }

        // Almacena los datos del usuario en req.user para usarlos después
        req.user = user;
        next(); // Pasa al siguiente middleware o controlador
    });
};

module.exports = authMiddleware;
