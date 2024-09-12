import express, { Request, Response } from 'express';
import db from './knex';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Basic GET Route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await db('users').select('*');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Creating new users -endpoint
app.post('/users', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    await db('users').insert({ email, password });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error: any) {
    console.error('Error creating user:', error); 
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Error creating user', error });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
