const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const reportesRoutes = require('./routes/reportesRoutes');


const app = express();
const PORT = 7007;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Usa las rutas importadas
app.use(reportesRoutes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);

    // Llama la función del servicio periódico
    //ejecutarServicioPeriodicoPredial();
});
