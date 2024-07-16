import { Request, Response } from 'express';
import multer, { MulterError } from 'multer';
import upload from './Service.ts';

class UploadFileController {
  public uploadFile = (req: Request, res: Response): void => {
    upload.single('file')(req, res, (err: any) => {
      if (err instanceof MulterError) {
        res.status(400).json({ message: err.message });
      } else if (err) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(200).json({ message: 'Archivo subido con éxito', file: req.file });
      }
    });
  }
}

export default new UploadFileController();
