import express from "express";
import { getForms, createForm, updateForm, deleteForm } from "../controllers/formsController";

const formRouter = express.Router();
formRouter.get("/", getForms);
formRouter.post("/", createForm);
formRouter.patch("/:id", updateForm);
formRouter.delete("/:id", deleteForm);


export default formRouter;
