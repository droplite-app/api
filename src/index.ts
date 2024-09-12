import express, { Request, Response } from 'express';
import db from './knex';
//comment
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Basic GET Route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await db('table-1').select('*');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
