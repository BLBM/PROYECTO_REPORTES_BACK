const express = require('express');
const { listaReportesDisponibles, reporteBackend , obtenerParametros,generarReporte} = require('../controllers/reportesController');
const router = express.Router();

router.get('/reportes/reporteBackend', reporteBackend);
router.get('/reportes/listaReportesDisponibles', listaReportesDisponibles);
router.get('/reportes/:reportId/params', obtenerParametros);

router.post('/reportes/generarReporte/:reportId', generarReporte);

module.exports = router;