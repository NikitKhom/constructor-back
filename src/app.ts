import express from 'express';
import query from './config/db';
import userRoutes from './routes/user';

const app = express();

// Middleware
app.use(express.json());

// Маршруты
app.use('/users', userRoutes);

// Запуск сервера
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
