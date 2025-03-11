import express from "express";
import styleRouter from "./styleRouter";
import userRouter from "./userRouter";
import formRouter from "./formRouter";
import formFieldRouter from "./formFieldRouter";

const router = express.Router();

router.use("/users", userRouter);
router.use("/styles", styleRouter);
router.use("/forms", formRouter);
router.use("/fields", formFieldRouter);

export default router;

