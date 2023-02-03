const userController  = require("../controllers/user");
const express = require("express");

const userRouter = express.Router();

userRouter.get("/", userController.getAll);
userRouter.get("/:id", userController.getOne);

module.exports = userRouter;
