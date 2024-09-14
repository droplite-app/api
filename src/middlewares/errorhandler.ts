import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const env = process.env.NODE_ENV || 'development';

  if (env !== 'production') {
    return res.status(500).json({ error: err.message, stack: err.stack });
  } else {
    return res.status(500).json({ message: 'An error occurred' });
  }
};

export default errorHandler;
