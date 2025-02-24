import { pool } from "../config/db";
import { Request, Response } from "express";

interface IUser {
    id: number;
    name: string;
    email: string;
  }

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    const { rows }: IUser[] = await pool.query<IUser>("SELECT * FROM users WHERE id = $1", [userId]);
    // if (user.length === 0) {
    //     res.status(404).json({ message: "Пользователь не найден" });
    //     return;
    // }
    console.log(user);
    res.status(200).json(user.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};



export {
  getUser,
};