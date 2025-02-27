import { Router } from "express";
import register from "../controllers/auth/register";
import login from "../controllers/auth/login";

const authRouter = Router();

authRouter.post("/signup", register);
authRouter.post("/signin", login);

export default authRouter;