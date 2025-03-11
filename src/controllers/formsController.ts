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
    const { name, description, style_id } = req.body;

    const { rows } = await pool.query(
      "INSERT INTO forms (user_id, name, description, style_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, name, description, style_id]
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
    const { name, description, style_id } = req.body;

    if (!formId) {
      res.status(400).json({ message: "ID не передан в URL" });
      return;
    }

    const formIdNum = Number(formId);
    if (isNaN(formIdNum)) {
      res.status(400).json({ message: "Некорректный ID формы" });
      return;
    }

    const { rowCount, rows } = await pool.query(
      "UPDATE forms SET name = $1, description = $2, style_id = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [name, description, style_id, formIdNum, userId]
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
