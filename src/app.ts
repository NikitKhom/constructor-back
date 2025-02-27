import express from "express";
import userRouter from "./routes/userRouter";
import { checkDBConnection } from "./config/db";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(authRouter);
app.use("/users", userRouter);


const startServer = async (): Promise<void> => {
  await checkDBConnection();
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
};

startServer();
