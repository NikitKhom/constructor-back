import express from "express";
import {  createFormField, updateFormField, deleteFormField } from "../controllers/fromFieldsController";

const formFieldRouter = express.Router();

formFieldRouter.post("/", createFormField);
formFieldRouter.patch("/:id", updateFormField);
formFieldRouter.delete("/:id", deleteFormField);    


export default formFieldRouter;
