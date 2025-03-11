import { NextFunction, Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../utils/types";
import {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND_ERROR,
  CREATED,
} from "../utils/constants";
import { ApiError } from "../middlewares/errorHandler";



export const getStyles = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError("Не авторизован", UNAUTHORIZED);
    }
    const userId = req.user.id;
    const { rows } = await pool.query("SELECT * FROM styles WHERE user_id = $1", [userId]);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const createStyle = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError("Не авторизован", UNAUTHORIZED);
    }
    const userId = req.user.id;
    const { name, formCss, inputCss, buttonCss } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO styles (user_id, name, form_css, input_css, button_css) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, name, formCss, inputCss, buttonCss]
    );

    res.status(CREATED).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateStyle = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError("Не авторизован", UNAUTHORIZED);
    }
    const userId = req.user.id;
    const styleId = req.params.id;
    const { name, formCss, inputCss, buttonCss } = req.body;

    if (!styleId) {
      throw new ApiError("ID не передан в URL", BAD_REQUEST);
    }

    const styleIdNum = Number(styleId);

    if (isNaN(styleIdNum)) {
      throw new ApiError("Некорректный ID стиля", BAD_REQUEST);
    }

    const { rowCount, rows } = await pool.query(
      "UPDATE styles SET name = $1, form_css = $2, input_css = $3, button_css = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
      [name, formCss, inputCss, buttonCss, styleId, userId]
    );

    if (rowCount === 0) {
      throw new ApiError("Стиль не найден", NOT_FOUND_ERROR);
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteStyle = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError("Не авторизован", UNAUTHORIZED);
    }
    const userId = req.user.id;
    const styleId = req.params.id;

    if (!styleId) {
      throw new ApiError("ID не передан в URL", BAD_REQUEST);
    }

    const styleIdNum = Number(styleId);

    if (isNaN(styleIdNum)) {
      throw new ApiError("Некорректный ID стиля", BAD_REQUEST);
    }

    const { rowCount } = await pool.query(
      "DELETE FROM styles WHERE id = $1 AND user_id = $2",
      [styleId, userId]
    );

    if (rowCount === 0) {
      throw new ApiError("Стиль не найден", NOT_FOUND_ERROR);
    }

    res.json({ message: "Стиль удалён" });
  } catch (error) {
    next(error);
  }
};
