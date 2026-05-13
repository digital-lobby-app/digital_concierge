import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import hotelsRoutes from './routes/hotels.routes';
import poisRoutes from './routes/pois.routes';
import reviewsRoutes from './routes/reviews.routes';
import settingsRoutes from './routes/settings.routes'; // when we are ready

const app: Application = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/hotels/:slug/pois', poisRoutes);
app.use('/hotels/:slug/reviews', reviewsRoutes);
app.use('/hotels', hotelsRoutes);
app.use('/settings', settingsRoutes); // when we are ready


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} 🏃🏽‍♂️`);
});
