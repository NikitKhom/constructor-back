import express, { Request, Response } from 'express';
import query from '../config/db';

const router = express.Router();

// Получение всех пользователей
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Добавление нового пользователя
router.post('/', async (req: Request, res: Response) => {
  const { username, email, password_hash } = req.body;
  try {
    const result = await query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [username, email, password_hash]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
