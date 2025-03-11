import express from "express";
import { getForms, createForm, updateForm, deleteForm } from "../controllers/formsController";
import { getFormFields } from "../controllers/fromFieldsController";

const formRouter = express.Router();
formRouter.get("/", getForms);
formRouter.get("/:formId/fields", getFormFields);
formRouter.post("/", createForm);
formRouter.patch("/:id", updateForm);
formRouter.delete("/:id", deleteForm);


export default formRouter;
