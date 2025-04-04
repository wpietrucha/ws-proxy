import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from TypeScript Express Server!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 