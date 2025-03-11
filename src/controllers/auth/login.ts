import { NextFunction, Request, Response } from "express";
import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BAD_REQUEST, NOT_FOUND_ERROR, UNAUTHORIZED } from "../../utils/constants";
import { ApiError } from "../../middlewares/errorHandler";

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError("Email или пароль не указаны", BAD_REQUEST);
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      throw new ApiError("Пользователь с таким email не найлен", NOT_FOUND_ERROR);
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      throw new ApiError("Неверный пароль", UNAUTHORIZED);
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET || "dev_key", { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

export default login;
