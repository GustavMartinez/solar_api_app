
// cargar las variables de entorno desde mi archivo .env
require('dotenv').config();

// Importar los modulos
const express = require('express');
const path = require('path');
const solarService = require('./services/solarService');
const fs = require('fs')

// Inicializar la aplicación de Express
const app = express();

// Define el puerto en el que correrá el servidor
const PORT = process.env.PORT || 3000;


// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para interpretar solicitudes con cuerpo en formato JSON
app.use(express.json());



/*
  Ruta POST '/api/solar' que recibe coordenadas (lat, lng) y consulta datos solares
*/

app.post('/api/solar', async (req, res) => {
    const { lat, lng } = req.body; // Usado para extraer latitud y longitud del cuerpo de la solicitud
  

    // verificar que ambas coordenadas estén presentes
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Faltan coordenadas' });
    }
  
    try {
      // Llamada al servicio solar para obtener datos basados en lat/long
      const data = await solarService.getSolarData(lat, lng);
  
      // Genera un nombre de archivo único con timestamp (fecha y hora)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `solar_response_${timestamp}.json`;
      const filepath = path.join(__dirname, filename);
  
      // Guardar los datos en un archivo JSON con formato legible
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
    
      // respuesta al cliente con los datos obtenidos
      res.json(data);
    } catch (error) {

      // Manejo de errores si falla la consulta a la API
      res.status(500).json({ error: 'Error al consultar la Solar API' });
    }
  });

// Iniciar servidor y muestra el mensaje en consola
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
