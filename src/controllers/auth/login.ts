import { Request, Response } from "express";
import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      res.status(400).json({ message: "Пользователь с таким email не найден" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      res.status(400).json({ message: "Неверный пароль" });
      return;
    }

    // Генерация JWT токена
    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    res.status(200).json({ message: "Авторизация прошла успешно", token });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
