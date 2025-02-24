import { Request, Response } from "express";
import { pool } from "../../config/db";
import bcrypt from "bcrypt";

const saltRound = 10;

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const userExist = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userExist.rows.length > 0) {
      res.status(400).json({message: "Пользователь с таким email уже существует!"});
      return;
    }
    const hashedPassword = await bcrypt.hash(password, saltRound);
        
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    res.status(201).json({ message: "Пользователь зарегистрирован"});
  } catch (error) {
    res.status(500).json({error: (error as Error).message});
  }
};
