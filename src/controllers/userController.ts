import { pool } from "../config/db";
import { Request, Response } from "express";

interface IUser {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
  }

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const result = await pool.query<IUser>("SELECT id, username, email, avatar FROM users WHERE id = $1", [userId]);
    const user: IUser[] = result.rows;
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





export {
  getUser,
};