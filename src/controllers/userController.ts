import { pool } from "../config/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

interface AuthRequest extends Request {
  user: { id: number };
}

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await pool.query("SELECT id, name, email, avatar FROM users");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user.id;
    console.log((req as AuthRequest).user);
    const {rows} = await pool.query("SELECT id, name, email, avatar FROM users WHERE id = $1", [userId]);
    
    if (rows.length === 0) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }
    const user = rows[0];
    user.avatar = user.avatar ?? "";
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const updatePassword = async (userId: string, newPassword: string): Promise<void> => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);
};


const updateUser = async (req: Request, res: Response) => {
  const { name, email, password, avatar } = req.body;
  const userId = (req as AuthRequest).user.id;
  try {
    if (password) {
      await updatePassword(String(userId), password);
    }

    const query = `
    UPDATE users
    SET 
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        avatar = COALESCE($3, avatar)
    WHERE id = $4
    RETURNING name, email, avatar;
    `;
    const values = [name, email, avatar, userId];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }
  
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
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
  getUsers,
  getUser,
  updateUser,
  deleteUser
};