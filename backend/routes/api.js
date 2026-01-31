import express from "express";
const router = express.Router();

import * as TaskController from "../app/controller/TaskController.js";
import * as UsersController from "../app/controller/UsersController.js";
import AuthMiddleware from "../app/middlewares/AuthMiddleware.js";
import { ProfileUpdate, ProfileDetails } from "../app/controller/UsersController.js";

router.post("/Registration", UsersController.Registration);
router.post("/Login", UsersController.Login);
router.get("/EmailVerify/:email", UsersController.EmailVerify);
router.get("/CodeVerify/:email/:code", UsersController.CodeVerify);
router.post("/ResetPassword", UsersController.ResetPassword);

router.get("/ProfileDetails", AuthMiddleware, UsersController.ProfileDetails);
router.put("/ProfileUpdate", AuthMiddleware, UsersController.ProfileUpdate);

router.post("/CreateTask", AuthMiddleware, TaskController.CreateTask);
router.put("/UpdateTask/:id", AuthMiddleware, TaskController.UpdateTask);
router.patch("/UpdateTaskStatus/:id/:status", AuthMiddleware, TaskController.UpdateTaskStatus);
router.get("/TaskListByStatus/:status", AuthMiddleware, TaskController.TaskListByStatus);
router.delete("/DeleteTask/:id", AuthMiddleware, TaskController.DeleteTask);
router.get("/CountTask", AuthMiddleware, TaskController.CountTask);

export default router;
