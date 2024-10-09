const client = require('../db'); 
const axios = require('axios');
const { Parser } = require('json2csv'); // Para convertir a CSV


const dominio =  "http://localhost:7007";

exports.reporteBackend = async (req, res) => {
    res.send('backend funcionando');
  };

exports.listaReportesDisponibles = async (req,res) => {
    const result = await client.query(`select rd.*,r.*
        from reporte r
        inner join reportes_disponibles rd on r.consecutivo = rd.reportes_id ;`);
    res.json(result.rows);   
}


exports.obtenerParametros = async (req,res) => {
    const { reportId } = req.params;
    try {
        const result = await client.query('select * from reporte_parametro rp where reporte = $1', [reportId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener parámetros:', error);
        res.status(500).json({ error: 'Error al obtener parámetros del reporte' });
    }
}

exports.generarReporte = async (req, res) => {
    const { reportId } = req.params;
    const { parameters } = req.body || {};// Obtener parámetros del cuerpo de la solicitud
    
    try {
      // Consulta para obtener la cadena SQL de la tabla correspondiente
      const queryResult = await client.query('select consulta_sql from reportes_disponibles rd WHERE reportes_id = $1', [reportId]);
      
      if (queryResult.rows.length === 0) {
        return res.status(404).json({ error: 'Reporte no encontrado.' });
      }
  
      let sqlQuery = queryResult.rows[0].consulta_sql;
  
     // Reemplazar parámetros en la consulta
     if (parameters && Object.keys(parameters).length > 0) {
      Object.keys(parameters).forEach((param) => {
          const valor = parameters[param];
          const regexVarchar = new RegExp(`\\?${param}::varchar`, 'g');
          const regexNumeric = new RegExp(`\\?${param}::numeric`, 'g');
          const regexDate = new RegExp(`\\?${param}::date`, 'g');
    
          // Asegurarse de que el valor se convierte correctamente al tipo adecuado
          if (typeof valor === 'string' && regexVarchar.test(sqlQuery)) {
            sqlQuery = sqlQuery.replace(regexVarchar, `'${valor}'`);
          } else if (typeof valor === 'number' && regexNumeric.test(sqlQuery)) {
            sqlQuery = sqlQuery.replace(regexNumeric, valor);
          } else if (valor instanceof Date && regexDate.test(sqlQuery)) {
            sqlQuery = sqlQuery.replace(regexDate, `'${valor.toISOString().split('T')[0]}'`);
          } else if (typeof valor === 'boolean') {
            const regexBoolean = new RegExp(`\\?${param}::boolean`, 'g');
            sqlQuery = sqlQuery.replace(regexBoolean, valor ? 'TRUE' : 'FALSE');
          } else {
            sqlQuery = sqlQuery.replace(new RegExp(`\\?${param}`, 'g'), `'${valor}'`);
          }
        });
    }
      
      // Ejecutar la consulta
      const result = await client.query(sqlQuery);
      
      // Convertir los resultados a CSV
      const csv = new Parser().parse(result.rows);
  
      // Enviar el CSV como respuesta
      res.header('Content-Type', 'text/csv');
      res.attachment(`reporte-${reportId}.csv`);
      res.send(csv);
    } catch (error) {
      console.error('Error generando el reporte:', error);
      res.status(500).json({ error: 'Error al generar el reporte.' });
    }
  };
  
  