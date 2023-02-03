const express = require("express");
const controller = require("../controllers/message.js");
const { jwtMiddleware } = require("../security/jwt.js");

const router = express.Router();

router.post("/save", controller.createPublicChatMessage);
router.get("/:chatId",jwtMiddleware, controller.getPrivateChatMessages);
router.get("/", controller.getPublicChatMessages);
router.post("/:chatId",jwtMiddleware, controller.createPrivateChatMessage);

module.exports = router;
