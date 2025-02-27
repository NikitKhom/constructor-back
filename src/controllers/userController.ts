import { pool } from "../config/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const result = await pool.query("SELECT id, username, email, avatar FROM users WHERE id = $1", [userId]);
    const user = result.rows;
    if (user.length === 0) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }
    user[0].avatar = user[0].avatar ?? "";
    res.status(200).json(user[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const updatePassword = async (userId: string, newPassword: string): Promise<void> => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);
};

const updateUserDetails = async (userId: string, name: string, email: string): Promise<void> => {
  await pool.query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email, userId]);
};

const updateUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const userId = req.params.id;

  if (password) {
    await updatePassword(userId, password);
  }

  await updateUserDetails(userId, name, email);

  res.json({ message: "Данные пользователя обновлены" });
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;

    const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    if (rowCount === 0) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    res.status(200).json({ message: "Пользователь успешно удалён" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export {
  getUser,
  updateUser,
  deleteUser
};