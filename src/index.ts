import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postUsersRoute from './routes/users/postUsers';
import errorHandler from './middlewares/errorhandler';

dotenv.config();
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Routes
app.use('/users', postUsersRoute);

// Default error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
