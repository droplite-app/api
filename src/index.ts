import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { postUserHandler } from './routes/users/postUsers';
import errorHandler from './middlewares/errorhandler';
import { postLoginHandler } from './routes/users/postLogin';

dotenv.config();
const app = express();
const port = 3000;

const whitelist = ['http://localhost:5173', 'https://cloud.droplite.app'];
const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(express.json());
app.use(cors(corsOptions));
app.post('/users', postUserHandler);
app.post('/login', postLoginHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
