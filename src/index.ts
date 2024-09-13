import express, { Request, Response } from 'express';
import db from './knex';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
const port = 3000;

const JWT_SECRET = process.env.JWT_SECRET || 'key';

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));


// Creating new users -endpoint
app.post('/users', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [userId] = await db('users').insert({ email, password }).returning('id');
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created successfully', token, userId });
  } catch (error: any) {
    console.error('Error creating user:', error); 
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Error creating user', error });
  }
});

app.post('/login', async(req: Request, res:Response)=>{
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try{
    const user = await db('users').where({email,password}).first();

    if(!user){
      return res.status(401).json({message:'Invalid email or password'})
    }

    const token = jwt.sign({userId: user.id},JWT_SECRET,{expiresIn:'1h'})
    res.status(200).json({ message: 'Login successful', token, userId: user.id });

  }catch(error:any){
    console.error('error logging in:', error)
    res.status(500).json({ message: 'Error logging in', error });
  }
})




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
