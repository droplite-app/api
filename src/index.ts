import { Express } from 'express';
import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

//middleware
app.use(express.json());

//simple get route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
