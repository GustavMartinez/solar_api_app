require('dotenv').config();
const express = require('express');
const path = require('path');
const solarService = require('./services/solarService');
const fs = require('fs')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Ruta para consultar datos solares
app.post('/api/solar', async (req, res) => {
    const { lat, lng } = req.body;
  
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Faltan coordenadas' });
    }
  
    try {
      const data = await solarService.getSolarData(lat, lng);
  
      // Guardar la respuesta en un archivo JSON con timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `solar_response_${timestamp}.json`;
      const filepath = path.join(__dirname, filename);
  
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar la Solar API' });
    }
  });

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
