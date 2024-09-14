import { Request, Response, NextFunction } from 'express';
import db from '../../knex';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validate, setLocales, en } from 'robust-validator';
import { SALT_ROUNDS } from '../../constants';

const JWT_SECRET = process.env.JWT_SECRET || 'key';
const saltRounds = 10;


setLocales(en);


const createUserValidation = {
  email: 'required|email',
  password: 'required|min:6|max:50',
  full_name: 'required|min:3|max:100',
};

export const postUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, full_name } = req.body;

  // Validate the input fields
  const result = await validate({ email, password, full_name }, createUserValidation);

  if (result.isInvalid) {
    return res.status(400).json({ message: result.errors });
  }

 
    // Check if the email already exists in the database
    const existingUser = await db('users').where({ email }).first();

    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    
    const [userId] = await db('users')
      .insert({ email, password: hashedPassword, full_name })
      .returning('id');

    
    const token = jwt.sign({ userId }, JWT_SECRET);

    res.status(201).json({token, userId });
   
};
