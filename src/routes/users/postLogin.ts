import { Request, Response, NextFunction } from 'express';
import db from '../../knex';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validate, setLocales, en } from 'robust-validator';

setLocales(en);
const JWT_SECRET = process.env.JWT_SECRET || 'key';

const loginValidation = {
  email: 'required|email',
  password: 'required|min:6',
};

export const postLoginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  const result = await validate({ email, password }, loginValidation);
  if (result.isInvalid) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await db('users').where({ email }).first();
  if (!user) {
    return res.status(404).json({ message: 'Invalid email or password' });
  }

  const passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    return res.status(404).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);

  res.status(200).json({ token, userId: user.id });
};
