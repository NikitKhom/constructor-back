// import { Request, Response } from "express";
// import jwt from "jsonwebtoken";

// const authMiddleware = (req: Request, res: Response, next) => {
//   const token = req.cookies.token; // Берём токен из куки
  
//   if (!token) {
//     return res.status(401).json({ message: "Не авторизован" });
//   }
  
//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Неверный или истёкший токен" });
//   }
// };

// export default authMiddleware;
  