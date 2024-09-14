import express, { Request, Response, NextFunction } from 'express';
import db from './knex';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validate, setLocales, en } from 'robust-validator';

dotenv.config();
const app = express();
const port = 3000;

setLocales(en);
const JWT_SECRET = process.env.JWT_SECRET || 'key';

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Validation definitions
const createUserValidation = {
  email: 'required|email',
  password: 'required|min:6|max:50',
};


const saltRounds = 10;

app.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;


  const result = await validate({ email, password }, createUserValidation);

 
  if (Object.keys(result.errors).length > 0) {
    return res.status(400).json({ message: result.errors });
  }


  const existingUser = await db('users').where({ email }).first();
    
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  // Hash the password before saving to the database
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const [userId] = await db('users')
    .insert({ email, password: hashedPassword })
    .returning('id');

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });

  res.status(201).json({ message: 'User created successfully', token, userId });
});

// Default error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  const env = process.env.NODE_ENV || 'development';

  if (env !== 'production') {
   
    return res.status(500).json({ error: err.message, stack: err.stack });
  } else {
    
    return res.status(500).json({ message: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
