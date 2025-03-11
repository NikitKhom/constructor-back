import { pool } from "../config/db";
import { NextFunction, Response } from "express";
import bcrypt from "bcrypt";
import { AuthRequest } from "../utils/types";
import { ApiError } from "../middlewares/errorHandler";
import { 
  UNAUTHORIZED,
  NOT_FOUND_ERROR
} from "../utils/constants";

const getUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await pool.query("SELECT id, name, email, avatar FROM users");
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};


const getUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError("Не авторизован", UNAUTHORIZED);
    }
    const userId = req.user.id;
    const {rows} = await pool.query("SELECT id, name, email, avatar FROM users WHERE id = $1", [userId]);
    
    if (rows.length === 0) {
      throw new ApiError("Пользователь не найден", NOT_FOUND_ERROR);
    }
    const user = rows[0];
    user.avatar = user.avatar ?? "";
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (userId: string, newPassword: string): Promise<void> => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);
};


const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { name, email, password, avatar } = req.body;
  if (!req.user) {
    throw new ApiError("Не авторизован", UNAUTHORIZED);
  }
  const userId = req.user.id;
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
      throw new ApiError("Пользователь не найден", NOT_FOUND_ERROR);
    }
  
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id;

    const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    if (rowCount === 0) {
      throw new ApiError("Пользователь не найден", NOT_FOUND_ERROR);
    }

    res.status(200).json({ message: "Пользователь успешно удалён" });
  } catch (error) {
    next(error);
  }
};

export {
  getUsers,
  getUser,
  updateUser,
  deleteUser
};