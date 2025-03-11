import express from "express";
import { getFormFields, createFormField, updateFormField, deleteFormField } from "../controllers/fromFieldsController";

const formFieldRouter = express.Router();
formFieldRouter.get("/", getFormFields);
formFieldRouter.post("/", createFormField);
formFieldRouter.patch("/:id", updateFormField);
formFieldRouter.delete("/:id", deleteFormField);    


export default formFieldRouter;
