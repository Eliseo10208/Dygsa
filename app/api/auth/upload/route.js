import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'app/public/facturas');

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm({
      multiples: false,
      uploadDir: uploadDir, 
      keepExtensions: true,
      filename: (name, ext, part, form) => {
        return `${Date.now()}_${part.originalFilename}`;
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error al subir el archivo' });
      }

      res.status(200).json({ data: files });
    });
  } else {
    res.status(405).json({ message: 'Metodo no permitido' });
  }
};

export default handler;
