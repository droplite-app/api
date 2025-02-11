import express, { Request, Response } from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const uploadRouter = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const upload = multer({ dest: 'uploads/' });

uploadRouter.post(
  '/upload',
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Dosya yüklenmedi!' });
      }

      const fileContent = fs.readFileSync(req.file.path);
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: req.file.originalname,
        Body: fileContent,
        ContentType: req.file.mimetype,
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);

      fs.unlinkSync(req.file.path);

      return res.status(200).json({ message: 'Dosya başarıyla yüklendi!' });
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      return res
        .status(500)
        .json({ error: 'Dosya yüklenirken bir hata oluştu!' });
    }
  },
);

export default uploadRouter;
