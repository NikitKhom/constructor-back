import express from "express";
import styleRouter from "./styleRouter";
import userRouter from "./userRouter";

const router = express.Router();

router.use("/users", userRouter);
router.use("/styles", styleRouter);

export default router;

