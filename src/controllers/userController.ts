import { pool } from "../config/db";
import { Request, Response } from "express";

const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.status(200).json(users.rows);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}

export {
    getUsers,
}