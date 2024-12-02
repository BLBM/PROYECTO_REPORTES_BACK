const { parentPort, workerData } = require('worker_threads');
const { Parser } = require('json2csv');
const client = require('../db'); // Asegúrate de importar tu conexión de base de datos

async function generateReport() {
    try {
        const { sqlQuery, reportId } = workerData;

        // Ejecuta la consulta SQL
        const result = await client.query(sqlQuery);

        // Convertir los resultados a CSV
        const csv = new Parser().parse(result.rows);

        // Enviar el CSV de vuelta al hilo principal
        parentPort.postMessage({ csv, reportId });
    } catch (error) {
        // Enviar el error de vuelta al hilo principal
        parentPort.postMessage({ error: error.message });
    }
}

// Llama a la función de generación de reportes
generateReport();
