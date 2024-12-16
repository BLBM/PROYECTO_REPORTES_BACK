const client = require('../db'); 
const bcrypt = require('bcryptjs');


const dominio =  "http://localhost:7007";

exports.createUserPost = async (req,res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Faltan parámetros necesarios' });
      }
    
      try {
        const newUser = await createUser({ username, password, email });
        res.status(201).json({
          message: 'Usuario creado con éxito',
          user: newUser,
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}




async function createUser({ username, password, email }) {
    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);
  
    // Consulta SQL para insertar el usuario
    const query = `
      INSERT INTO users (username, password_hash, email, status, created_at, updated_at)
      VALUES ($1, $2, $3, 'active', NOW(), NOW())
      RETURNING user_id, username, email, status, created_at, updated_at
    `;
    
    const values = [username, passwordHash, email];
  
    try {
      // Ejecuta la consulta
      const result = await client.query(query, values);
      return result.rows[0]; // Devuelve los detalles del usuario creado
    } catch (error) {
      throw new Error('Error al crear el usuario: ' + error.message);
    }
  }