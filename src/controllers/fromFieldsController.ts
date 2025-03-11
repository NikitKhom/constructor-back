import { Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../utils/types"; 

export const getFormFields = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Не авторизован" });
      return;
    }
    const userId = req.user.id;
    const formId = req.params.formId;
  
    const { rows } = await pool.query(
      "SELECT * FROM form_fields WHERE form_id = $1 AND user_id = $2",
      [formId, userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
  
export const createFormField = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Не авторизован" });
      return;
    }
    const userId = req.user.id;
    const { formId, label, type, placeholder, required } = req.body;
  
    const { rows } = await pool.query(
      "INSERT INTO form_fields (form_id, user_id, label, type, placeholder, required) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [formId, userId, label, type, placeholder, required]
    );
  
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
  
export const updateFormField = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Не авторизован" });
      return;
    }
    const userId = req.user.id;
    const fieldId = req.params.id;
    const { label, type, placeholder, required } = req.body;
  
    const { rowCount, rows } = await pool.query(
      "UPDATE form_fields SET label = $1, type = $2, placeholder = $3, required = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
      [label, type, placeholder, required, fieldId, userId]
    );
  
    if (rowCount === 0) {
      res.status(404).json({ message: "Поле формы не найдено" });
      return;
    }
  
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
  
export const deleteFormField = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Не авторизован" });
      return;
    }
    const userId = req.user.id;
    const fieldId = req.params.id;
  
    const { rowCount } = await pool.query(
      "DELETE FROM form_fields WHERE id = $1 AND user_id = $2",
      [fieldId, userId]
    );
  
    if (rowCount === 0) {
      res.status(404).json({ message: "Поле формы не найдено" });
      return;
    }
  
    res.json({ message: "Поле формы удалено" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
  