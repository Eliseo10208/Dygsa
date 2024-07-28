const express = require('express');
const next = require('next');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const uploadDirectory = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

app.prepare().then(() => {
  const server = express();

  // Ruta de API para subir archivos
  server.post('/api/upload', upload.single('file'), (req, res) => {
    const filePath = path.join(uploadDirectory, req.file.filename);

    // Leer el archivo y mostrar su contenido en la consola
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return res.status(500).json({ message: 'Error al leer el archivo' });
      }

      const base64Data = data.toString('base64'); // Convertir a Base64
      // console.log(base64Data); // Mostrar el contenido del archivo en la consola

      res.status(200).json({ message: 'Archivo subido exitosamente', content: base64Data });
    });
  });

  // Manejar todas las demás solicitudes con Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
