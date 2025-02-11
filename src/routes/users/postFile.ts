import express, { Request, Response } from "express";
import multer from "multer";
import AWS from "aws-sdk";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // .env dosyasından çevresel değişkenleri yükler

const app = express();
const port = process.env.PORT || 3000;

// CORS Middleware
app.use(cors());
app.use(express.json());

// AWS S3 yapılandırması
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer ile dosya yükleme ayarları
const upload = multer({ dest: "uploads/" });

// 🚀 Dosya yükleme endpointi
app.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Dosya yüklenmedi!" });
    }

    const fileContent = fs.readFileSync(req.file.path);
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: req.file.originalname,
      Body: fileContent,
      ContentType: req.file.mimetype,
    };

    const uploadedFile = await s3.upload(params).promise();

    // Geçici dosyayı sil
    fs.unlinkSync(req.file.path);

    return res.status(200).json({ message: "Dosya başarıyla yüklendi!", url: uploadedFile.Location });
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    return res.status(500).json({ error: "Dosya yüklenirken bir hata oluştu!" });
  }
});

// 🌍 Sunucuyu başlat
app.listen(port, () => {
  console.log(`🚀 Sunucu http://localhost:${port} adresinde çalışıyor`);
});
