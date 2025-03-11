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
    const formId = Number(req.params.formId);

    if (isNaN(formId)) {
      res.status(400).json({ message: "Некорректный ID формы" });
      return;
    }

    const formCheck = await pool.query("SELECT id FROM forms WHERE id = $1 AND user_id = $2", [formId, userId]);
    if (formCheck.rowCount === 0) {
      res.status(404).json({ message: "Форма не найдена" });
      return;
    }

    const { rows } = await pool.query("SELECT * FROM form_fields WHERE form_id = $1", [formId]);
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
    const { formId, fieldName, fieldType, placeholder, required, position, isButton } = req.body;

    if (!formId) {
      res.status(400).json({ message: "Не передан ID формы" });
      return;
    }

    const formIdNum = Number(formId);
    if (isNaN(formIdNum)) {
      res.status(400).json({ message: "Некорректный ID формы" });
      return;
    }

    const formCheck = await pool.query("SELECT id FROM forms WHERE id = $1 AND user_id = $2", [formIdNum, userId]);
    if (formCheck.rowCount === 0) {
      res.status(404).json({ message: "Форма не найдена" });
      return;
    }

    const { rows } = await pool.query(
      "INSERT INTO form_fields (form_id, field_name, field_type, placeholder, required, position, is_button) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [formIdNum, fieldName, fieldType, placeholder, required, position, isButton]
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
    const fieldId = Number(req.params.id);
    const { fieldName, fieldType, placeholder, required, position, isButton } = req.body;

    if (isNaN(fieldId)) {
      res.status(400).json({ message: "Некорректный ID поля" });
      return;
    }

    const fieldCheck = await pool.query(
      "SELECT form_id FROM form_fields WHERE id = $1",
      [fieldId]
    );
    if (fieldCheck.rowCount === 0) {
      res.status(404).json({ message: "Поле не найдено" });
      return;
    }

    const formId = fieldCheck.rows[0].form_id;
    const formCheck = await pool.query("SELECT id FROM forms WHERE id = $1 AND user_id = $2", [formId, userId]);
    if (formCheck.rowCount === 0) {
      res.status(403).json({ message: "Нет доступа к данной форме" });
      return;
    }

    const { rowCount, rows } = await pool.query(
      "UPDATE form_fields SET field_name = $1, field_type = $2, placeholder = $3, required = $4, position = $5, is_button = $6 WHERE id = $7 RETURNING *",
      [fieldName, fieldType, placeholder, required, position, isButton, fieldId]
    );

    if (rowCount === 0) {
      res.status(404).json({ message: "Поле не найдено" });
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
    const fieldId = Number(req.params.id);

    if (isNaN(fieldId)) {
      res.status(400).json({ message: "Некорректный ID поля" });
      return;
    }

    const fieldCheck = await pool.query(
      "SELECT form_id FROM form_fields WHERE id = $1",
      [fieldId]
    );
    if (fieldCheck.rowCount === 0) {
      res.status(404).json({ message: "Поле не найдено" });
      return;
    }

    const formId = fieldCheck.rows[0].form_id;
    const formCheck = await pool.query("SELECT id FROM forms WHERE id = $1 AND user_id = $2", [formId, userId]);
    if (formCheck.rowCount === 0) {
      res.status(403).json({ message: "Нет доступа к данной форме" });
      return;
    }

    const { rowCount } = await pool.query(
      "DELETE FROM form_fields WHERE id = $1",
      [fieldId]
    );

    if (rowCount === 0) {
      res.status(404).json({ message: "Поле не найдено" });
      return;
    }

    res.json({ message: "Поле удалено" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
