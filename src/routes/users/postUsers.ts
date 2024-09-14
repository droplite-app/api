import express, { Request, Response, NextFunction } from 'express';
import db from '../../knex';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validate, setLocales, en } from 'robust-validator';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'key';
const saltRounds = 10;

// Validation setup
setLocales(en);

const createUserValidation = {
  email: 'required|email',
  password: 'required|min:6|max:50',
  full_name: 'required|min:3|max:100', 
};

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, full_name } = req.body; 

  // Validation
  const result = await validate({ email, password, full_name }, createUserValidation);

  if (Object.keys(result.errors).length > 0) {
    return res.status(400).json({ message: result.errors });
  }

  try {
    const existingUser = await db('users').where({ email }).first();

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

   
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    
    const [userId] = await db('users')
      .insert({ email, password: hashedPassword, full_name }) 
      .returning('id');

    
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User created successfully', token, userId });
  } catch (err) {
    next(err);
  }
});

export default router;
