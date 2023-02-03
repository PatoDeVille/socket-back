const chatController = require("../controllers/chat");
const express = require("express");

const chatRouter = express.Router();

chatRouter.get("/", chatController.getAll);
chatRouter.get("/:id", chatController.getOne);
chatRouter.post("/", chatController.createOne);
chatRouter.delete("/:id", chatController.deleteOne);

module.exports = chatRouter;
