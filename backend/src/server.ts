import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import hotelsRoutes from './routes/hotels.routes';

const app: Application = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/hotels', hotelsRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} 🏃🏽‍♂️`);
});
