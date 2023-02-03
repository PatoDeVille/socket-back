const express = require("express");
const generalRouter = express.Router();
const messagesRouter = require('./message')
const { jwtMiddleware,authRouter } = require('../security/jwt');
const chatRouter = require("./chats");
const userRouter = require("./user");

generalRouter.use("/", authRouter);
generalRouter.use('/message',messagesRouter)
generalRouter.use('/chat',jwtMiddleware,chatRouter)
generalRouter.use('/user',userRouter)

module.exports = generalRouter;
