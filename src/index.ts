import express, { Request, Response } from 'express';
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

const loginValidation = {
  email: 'required|email',
  password: 'required|min:6|max:50',
};

// Password Hashing Configuration
const saltRounds = 10;

// Creating new users -endpoint
app.post('/users', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validation for user creation
  const result = await validate({ email, password }, createUserValidation);

  // Eğer result.errors varsa validasyon hatalarını döndür
  if (Object.keys(result.errors).length > 0) {
    return res.status(400).json({ message: result.errors });
  }

  try {
    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [userId] = await db('users')
      .insert({ email, password: hashedPassword })
      .returning('id');
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
    res
      .status(201)
      .json({ message: 'User created successfully', token, userId });
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Login user - endpoint
app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validation for login
  const result = await validate({ email, password }, loginValidation);

  if (Object.keys(result.errors).length > 0) {
    return res.status(400).json({ message: result.errors });
  }

  try {
    const user = await db('users').where({ email }).first();

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the hashed password with the provided password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res
      .status(200)
      .json({ message: 'Login successful', token, userId: user.id });
  } catch (error: any) {
    console.error('error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
