import { NextFunction, Request, Response } from "express";
import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BAD_REQUEST, CONFLICT, CREATED, SALT_ROUNDS } from "../../utils/constants";
import { ApiError } from "../../middlewares/errorHandler";

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      throw new ApiError("Email, пароль или имя не указаны", BAD_REQUEST);
    }
    const userExist = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userExist.rows.length > 0) {
      throw new ApiError("Пользователь с таким email уже существует", CONFLICT);
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET || "dev_key", { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });


    res.status(CREATED).json(newUser.rows[0]);
  } catch (error) {
    next(error);
  }
};

export default register;
