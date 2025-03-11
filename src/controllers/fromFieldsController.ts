import { NextFunction, Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../utils/types";
import { BAD_REQUEST, UNAUTHORIZED, CREATED, NOT_FOUND_ERROR, FORBIDDEN } from "../utils/constants";
import { ApiError } from "../middlewares/errorHandler";

export const getFormFields = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError("Не авторизован", UNAUTHORIZED);
    }

    const userId = req.user.id;
    const formId = Number(req.params.formId);

    if (!formId) {
      throw new ApiError("Не передан ID формы", BAD_REQUEST);
    }

    if (isNaN(formId)) {
      throw new ApiError("Некорректный ID формы", BAD_REQUEST);
    }

    const formCheck = await pool.query("SELECT id FROM forms WHERE id = $1 AND user_id = $2", [formId, userId]);
    if (formCheck.rowCount === 0) {
      throw new ApiError("Форма не найдена", NOT_FOUND_ERROR);
    }

    const { rows } = await pool.query("SELECT * FROM form_fields WHERE form_id = $1", [formId]);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const createFormField = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError("Не авторизован", UNAUTHORIZED);
    }

    const userId = req.user.id;
    const { formId, fieldName, fieldType, placeholder, required, position, isButton } = req.body;

    if (!formId) {
      throw new ApiError("Не передан ID формы", BAD_REQUEST);
    }

    const formIdNum = Number(formId);
    if (isNaN(formIdNum)) {
      throw new ApiError("Некорректный ID формы", BAD_REQUEST);
    }

    const formCheck = await pool.query("SELECT id FROM forms WHERE id = $1 AND user_id = $2", [formIdNum, userId]);
    if (formCheck.rowCount === 0) {
      throw new ApiError("Форма не найдена", NOT_FOUND_ERROR);
    }

    const { rows } = await pool.query(
      "INSERT INTO form_fields (form_id, field_name, field_type, placeholder, required, position, is_button) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [formIdNum, fieldName, fieldType, placeholder, required, position, isButton]
    );

    res.status(CREATED).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateFormField = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError("Не авторизован", UNAUTHORIZED);
    }

    const userId = req.user.id;
    const fieldId = Number(req.params.id);
    const { fieldName, fieldType, placeholder, required, position, isButton } = req.body;

    if (isNaN(fieldId)) {
      throw new ApiError("Некорректный ID поля", BAD_REQUEST);
    }

    const fieldCheck = await pool.query(
      "SELECT form_id FROM form_fields WHERE id = $1",
      [fieldId]
    );
    if (fieldCheck.rowCount === 0) {
      throw new ApiError("Поле не найдено", NOT_FOUND_ERROR);
    }

    const formId = fieldCheck.rows[0].form_id;
    const formCheck = await pool.query("SELECT id FROM forms WHERE id = $1 AND user_id = $2", [formId, userId]);
    if (formCheck.rowCount === 0) {
      throw new ApiError("Нет доступа к данной форме", FORBIDDEN);
    }

    const { rowCount, rows } = await pool.query(
      "UPDATE form_fields SET field_name = $1, field_type = $2, placeholder = $3, required = $4, position = $5, is_button = $6 WHERE id = $7 RETURNING *",
      [fieldName, fieldType, placeholder, required, position, isButton, fieldId]
    );

    if (rowCount === 0) {
      throw new ApiError("Поле не найдено", NOT_FOUND_ERROR);
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteFormField = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError("Не авторизован", UNAUTHORIZED);
    }

    const userId = req.user.id;
    const fieldId = Number(req.params.id);

    if (isNaN(fieldId)) {
      throw new ApiError("Некорректный ID поля", BAD_REQUEST);
    }

    const fieldCheck = await pool.query(
      "SELECT form_id FROM form_fields WHERE id = $1",
      [fieldId]
    );
    if (fieldCheck.rowCount === 0) {
      throw new ApiError("Поле не найдено", NOT_FOUND_ERROR);
    }

    const formId = fieldCheck.rows[0].form_id;
    const formCheck = await pool.query("SELECT id FROM forms WHERE id = $1 AND user_id = $2", [formId, userId]);
    if (formCheck.rowCount === 0) {
      throw new ApiError("Нет доступа к данной форме", FORBIDDEN);
    }

    const { rowCount } = await pool.query(
      "DELETE FROM form_fields WHERE id = $1",
      [fieldId]
    );

    if (rowCount === 0) {
      throw new ApiError("Поле не найдено", NOT_FOUND_ERROR);
    }

    res.json({ message: "Поле удалено" });
  } catch (error) {
    next(error);
  }
};
