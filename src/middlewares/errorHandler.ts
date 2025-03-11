import { Request, Response, NextFunction } from "express";

class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Ошибка сервера";

  res.status(statusCode).json({ message });
  next();
};

export { errorHandler, ApiError };
