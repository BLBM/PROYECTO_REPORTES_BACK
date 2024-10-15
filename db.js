const { Client } = require('pg');

/* 
//BASE DE DATOS DESARROLLO

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'desarrollo_sahagun',
    password: '1234',
    port: 5432,
});

//BASE DE DATOS PRODUCCION

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'produccion_sahagun_local',
    password: 'R3alt1x2021*',
    port: 5432,
});
*/

const client = new Client({
    user: 'postgres',
    host: '192.168.1.52',
    database: 'desarrollo_sahagun',
    password: '1234',
    port: 5432,
});

client.connect((err) => {
    if (err) {
      console.error('Error de conexión:', err.stack);
    } else {
      console.log('Conexión exitosa a la base de datos');
    }
});

module.exports = client;