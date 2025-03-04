import express from "express";
import { getUser, updateUser, deleteUser } from "../controllers/userController";

const userRouter = express.Router();
userRouter.get("/:id", getUser);
userRouter.patch("/:id", updateUser);
userRouter.delete("/:id", deleteUser);


export default userRouter;
