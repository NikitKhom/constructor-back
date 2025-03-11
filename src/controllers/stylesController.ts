import { Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../utils/types"; 



export const getStyles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Не авторизован" });
      return;
    }
    const userId = req.user.id;
    const { rows } = await pool.query("SELECT * FROM styles WHERE user_id = $1", [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const createStyle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Не авторизован" });
      return;
    }
    const userId = req.user.id;
    const { name, form_css, input_css, button_css } = req.body;

    const { rows } = await pool.query(
      "INSERT INTO styles (user_id, name, form_css, input_css, button_css) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, name, form_css, input_css, button_css]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const updateStyle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Не авторизован" });
      return;
    }
    const userId = req.user.id;
    const styleId = req.params.id;
    const { name, form_css, input_css, button_css } = req.body;

    if (!styleId) {
      res.status(400).json({ message: "ID не передан в URL" });
      return;
    }

    const styleIdNum = Number(styleId);

    if (isNaN(styleIdNum)) {
      res.status(400).json({ message: "Некорректный ID стиля" });
      return;
    }

    const { rowCount, rows } = await pool.query(
      "UPDATE styles SET name = $1, form_css = $2, input_css = $3, button_css = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
      [name, form_css, input_css, button_css, styleId, userId]
    );

    if (rowCount === 0) {
      res.status(404).json({ message: "Стиль не найден" });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const deleteStyle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Не авторизован" });
      return;
    }
    const userId = req.user.id;
    const styleId = req.params.id;

    if (!styleId) {
      res.status(400).json({ message: "ID не передан в URL" });
      return; 
    }

    const styleIdNum = Number(styleId);

    if (isNaN(styleIdNum)) {
      res.status(400).json({ message: "Некорректный ID стиля" });
      return;
    }

    const { rowCount } = await pool.query(
      "DELETE FROM styles WHERE id = $1 AND user_id = $2",
      [styleId, userId]
    );

    if (rowCount === 0) {
      res.status(404).json({ message: "Стиль не найден" });
      return;
    }

    res.json({ message: "Стиль удалён" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
