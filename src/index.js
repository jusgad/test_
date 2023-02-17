const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/entities/filter', async (req, res) => {
  const { startId, endId } = req.body;

  if (!startId || !endId || startId > endId) {
    res.status(101).json({ Error: 'Error en validación de datos de entrada' });
    return;
  }

  const entities = [];

  for (let entityId = startId; entityId <= endId; entityId++) {
    try {
      const response = await axios.get(`https://awovcw7p76.execute-api.us-east-1.amazonaws.com/dev/entity/v2.1/entities/${entityId}`);
      const entity = response.data;

      if (!entity.name) {
        throw new Error('No se encontró entidad para el código especificado');
      }

      entities.push(entity);
    } catch (error) {
      res.status(101).json({ Error: error.message });
      return;
    }
  }

  entities.sort((a, b) => a.name.localeCompare(b.name));

  res.json(entities);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
