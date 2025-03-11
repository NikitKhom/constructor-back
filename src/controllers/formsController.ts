import { Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../utils/types"; 

export const getForms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Не авторизован" });
      return;
    }
    const userId = req.user.id;
    const { rows } = await pool.query("SELECT * FROM forms WHERE user_id = $1", [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createForm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Не авторизован" });
      return;
    }
    const userId = req.user.id;
    const { name, style_id } = req.body;

    if (!style_id) {
      res.status(400).json({ message: "Style ID обязателен" });
      return;
    }

    const styleCheck = await pool.query("SELECT id FROM styles WHERE id = $1 AND user_id = $2", [style_id, userId]);
    if (styleCheck.rowCount === 0) {
      res.status(400).json({ message: "Указанный style_id не существует или не принадлежит пользователю" });
      return;
    }

    const { rows } = await pool.query(
      "INSERT INTO forms (user_id, name, style_id) VALUES ($1, $2, $3) RETURNING *",
      [userId, name, style_id]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateForm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Не авторизован" });
      return;
    }
    const userId = req.user.id;
    const formId = req.params.id;
    const { name, style_id } = req.body;

    if (!formId) {
      res.status(400).json({ message: "ID не передан в URL" });
      return;
    }

    const formIdNum = Number(formId);
    if (isNaN(formIdNum)) {
      res.status(400).json({ message: "Некорректный ID формы" });
      return;
    }

    if (style_id) {
      // Проверяем, существует ли стиль в базе
      const styleCheck = await pool.query("SELECT id FROM styles WHERE id = $1 AND user_id = $2", [style_id, userId]);
      if (styleCheck.rowCount === 0) {
        res.status(400).json({ message: "Указанный style_id не существует или не принадлежит пользователю" });
        return;
      }
    }

    const { rowCount, rows } = await pool.query(
      "UPDATE forms SET name = $1, style_id = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [name, style_id, formIdNum, userId]
    );

    if (rowCount === 0) {
      res.status(404).json({ message: "Форма не найдена" });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteForm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Не авторизован" });
      return;
    }
    const userId = req.user.id;
    const formId = req.params.id;

    if (!formId) {
      res.status(400).json({ message: "ID не передан в URL" });
      return;
    }

    const formIdNum = Number(formId);
    if (isNaN(formIdNum)) {
      res.status(400).json({ message: "Некорректный ID формы" });
      return;
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
    res.status(500).json({ message: (error as Error).message });
  }
};
