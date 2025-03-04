// import { pool } from "../config/db";
// import { Request, Response } from "express";

// const getAllStyles = async (req: Request, res: Response): Promise<void> => {
//   const userId = Number(req.params.id);

//   if (isNaN(userId)) {
//     res.status(400).json({ message: "Указан некорретный ID"});
//     return;
//   }

//   try {
//     const result = await pool.query("SELECT * FROM styles WHERE user_id = $1", [userId]);
//     if (result.rows.length === 0) {
//       res.status(404).json({ message: "Не удалось найти стили"});
//       return;
//     }

//     res.status(200).json(result.rows);
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };

// const createStyle = async (req: Request, res: Response): Promise<void> => {
//   const { user_id, form_css, input_css, button_css } = req.body;

//   // Проверка обязательных полей
//   if (!user_id || !form_css || !input_css || !button_css) {
//     res.status(400).json({ message: "Все поля должны быть заполнены" });
//     return;
//   }

//   try {
//     // Вставка нового стиля в таблицу styles
//     const result = await pool.query(
//       'INSERT INTO styles (user_id, form_css, input_css, button_css) VALUES ($1, $2, $3, $4) RETURNING id',
//       [user_id, form_css, input_css, button_css]
//     );

//     // Возвращаем id нового стиля
//     res.status(201).json({ style_id: result.rows[0].id });
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };

// export { getAllStyles, createStyle };
