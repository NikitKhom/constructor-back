import express from "express";
import { getUsers, getUser, updateUser, deleteUser } from "../controllers/userController";

const userRouter = express.Router();
userRouter.get("/", getUsers);
userRouter.get("/me", getUser);
userRouter.patch("/me", updateUser);
userRouter.delete("/:id", deleteUser);


export default userRouter;
