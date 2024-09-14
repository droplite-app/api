import { Request, Response, NextFunction } from 'express';
import db from '../../knex';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'key';

export const postLoginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  //mail check
  const user = await db('users').where({ email }).first();
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  //password check
  const passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  //token
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);

  res.status(200).json({ message: 'Login successful', token, userId: user.id });
};
