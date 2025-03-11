import express from "express";
import router from "./routes";
import { checkDBConnection } from "./config/db";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import authMiddleware from "./middlewares/auth";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());  
app.use(express.json());
app.use(cookieParser());
app.use(authRouter);
app.use(authMiddleware);
app.use(router);
app.use(errorHandler);


const startServer = async (): Promise<void> => {
  await checkDBConnection();
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
};

startServer();
