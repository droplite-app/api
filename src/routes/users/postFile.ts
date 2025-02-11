import express, { Request, Response } from "express";
import multer from "multer";
import AWS from "aws-sdk";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});


const upload = multer({ dest: "uploads/" });


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

    
    fs.unlinkSync(req.file.path);

    return res.status(200).json({ message: "Dosya başarıyla yüklendi!", url: uploadedFile.Location });
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    return res.status(500).json({ error: "Dosya yüklenirken bir hata oluştu!" });
  }
});


app.listen(port, () => {
  console.log(`🚀 Sunucu http://localhost:${port} adresinde çalışıyor`);
});
