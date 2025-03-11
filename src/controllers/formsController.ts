import { NextFunction, Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../utils/types"; 
import { ApiError } from "../middlewares/errorHandler";
import { BAD_REQUEST, CREATED, FORBIDDEN, NOT_FOUND_ERROR, UNAUTHORIZED } from "../utils/constants";


export const getForms = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError("Не авторизован", UNAUTHORIZED);
    }
    const userId = req.user.id;
    const { rows } = await pool.query("SELECT * FROM forms WHERE user_id = $1", [userId]);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const createForm = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError("Не авторизован", UNAUTHORIZED);
    }
    const userId = req.user.id;
    const { name, style_id } = req.body;

    if (!style_id) {
      throw new ApiError("Style ID обязателен", BAD_REQUEST);
    }

    const styleCheck = await pool.query("SELECT id FROM styles WHERE id = $1 AND user_id = $2", [style_id, userId]);
    if (styleCheck.rowCount === 0) {
      throw new ApiError("Указанный style_id не существует или не принадлежит пользователю", FORBIDDEN);
    }

    const { rows } = await pool.query(
      "INSERT INTO forms (user_id, name, style_id) VALUES ($1, $2, $3) RETURNING *",
      [userId, name, style_id]
    );

    res.status(CREATED).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateForm = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError("Не авторизован", UNAUTHORIZED);
    }
    const userId = req.user.id;
    const formId = req.params.id;
    const { name, style_id } = req.body;

    if (!formId) {
      throw new ApiError("ID не передан в URL", BAD_REQUEST);
    }

    const formIdNum = Number(formId);
    if (isNaN(formIdNum)) {
      throw new ApiError("Передан некорретный ID", BAD_REQUEST);
    }

    if (style_id) {
      const styleCheck = await pool.query("SELECT id FROM styles WHERE id = $1 AND user_id = $2", [style_id, userId]);
      if (styleCheck.rowCount === 0) {
        throw new ApiError("Указанный style_id не существует или не принадлежит пользователю", FORBIDDEN);
      }
    }

    const { rowCount, rows } = await pool.query(
      "UPDATE forms SET name = $1, style_id = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [name, style_id, formIdNum, userId]
    );

    if (rowCount === 0) {
      throw new ApiError("Форма не найдена", NOT_FOUND_ERROR);
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteForm = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError("Не авторизован", UNAUTHORIZED);
    }
    const userId = req.user.id;
    const formId = req.params.id;

    if (!formId) {
      throw new ApiError("ID не передан в URL", BAD_REQUEST);
      return;
    }

    const formIdNum = Number(formId);
    if (isNaN(formIdNum)) {
      throw new ApiError("Передан некорретный ID", BAD_REQUEST);
    }

    const { rowCount } = await pool.query(
      "DELETE FROM forms WHERE id = $1 AND user_id = $2",
      [formIdNum, userId]
    );

    if (rowCount === 0) {
      res.status(404).json({ message: "Форма не найдена" });
      return;
    }

    res.json({ message: "Форма удалена" });
  } catch (error) {
    next(error);
  }
};
