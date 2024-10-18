const express = require('express');
const { listaReportesDisponibles, reporteBackend , obtenerParametros,generarReporte} = require('../controllers/reportesController');
const authenticateToken = require('../middlewares/authMiddleware'); // Importar el middleware
const router = express.Router();

router.get('/reportes/reporteBackend', authenticateToken , reporteBackend);
router.get('/reportes/listaReportesDisponibles', authenticateToken, listaReportesDisponibles);
router.get('/reportes/:reportId/params',authenticateToken, obtenerParametros);
router.post('/reportes/generarReporte/:reportId', authenticateToken , generarReporte);


module.exports = router;