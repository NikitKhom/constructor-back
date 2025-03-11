import express from "express";
import { getStyles, updateStyle, createStyle, deleteStyle } from "../controllers/stylesController";

const styleRouter = express.Router();
styleRouter.get("/", getStyles);
styleRouter.post("/", createStyle);
styleRouter.patch("/:id", updateStyle);
styleRouter.delete("/:id", deleteStyle);    


export default styleRouter;
