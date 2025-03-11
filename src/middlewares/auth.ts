import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../utils/types";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  
  if (!token) {
    res.status(401).json({ message: "Не авторизован" });
    return;
  }
  
  try {
    const decoded = jwt.verify(token,  process.env.JWT_SECRET || "dev_key");
    (req as AuthRequest).user = decoded as {id: number};
    next();
  } catch (error) {
    res.status(401).json({ message: "Неверный или истёкший токен" });
  }
};

export default authMiddleware;
  