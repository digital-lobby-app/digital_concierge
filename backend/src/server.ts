import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';

const app: Application = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', authRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} 🏃🏽‍♂️`);
});
