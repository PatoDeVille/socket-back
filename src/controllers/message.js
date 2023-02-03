const Message = require("../models/message");
const Chat = require("../models/chat")
const ChatMessage = require('../models/chat-message')
const socketServer = require("../index");

const createPublicChatMessage = (req, res) => {
  const { body, from } = req.body;
  const newMessage = new Message({ body, from });

  newMessage.save((error, messageStored) => {
    if (error || !messageStored) {
      return res.status(404).send({
        status: "error",
        message: "Error saving message",
      });
    }
// despues de crear el mensaje de manera exitosa,
// le decimos al socket que emita un evento
    socketServer.io.emit("NEW_MESSAGE", newMessage);

    return res.status(200).send({
      status: "success",
      messageStored,
    });
  });
};

//Función para obtener los mensajes
const getPublicChatMessages = (req, res) => {
    //buscamos los mensajes y los ordenamos a los mas nuevos primero
  const query = Message.find({}).sort({ created_at: -1 });

  query.exec((error, messages) => {
    if (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al extraer los datos",
      });
    }

    //Si no existen mensajes:
    if (!messages) {
      return res.status(404).send({
        status: "error",
        message: "No hay mensajes para mostrar",
      });
    }

    return res.status(200).send({
      status: "success",
      messages,
    });
  });
};

const createPrivateChatMessage = async (req, res) => {
	try {
        // antes de crear el mensaje, garantizamos que exista el chat que tenga el mensaje
		const chat = await Chat.findById(req.params.chatId);
		if(chat){
			if(req.body.body){
				const message = new ChatMessage({user: req.jwtPayload.id, chat: req.params.chatId, body: req.body.body});
				message.save().then(newMessage => {
					ChatMessage.populate(newMessage, {path: 'user'}, (err, m) => {
						
                        // una vez que se crea un mensaje de chat se informa al grupo que toca, con un evento
                        // de NEW_MESSAGE
                        // ! importante que estamos usando el socket PRIVADO
                        socketServer.ioPrivate.to(`chat-${m.chat}`).emit("NEW_MESSAGE", m);

                        // * Sistema de notificaciones personales
						// chat.users.filter(u => u !== req.jwtPayload.id).forEach(user => {
						// 	server.ioPrivate.to(`user-${user._id}`).emit("new-chat-message", m);
						// })
						
                        res.status(201).json(m);
					})

				}).catch(e =>  {
					res.status(500).json({error: e.message})
				});
			}
		}else{
			res.status(500).json({error: "wrong chat ID"});
		}
	}catch (e) {
		res.status(500).json({error: e.message});
	}
}
const getPrivateChatMessages = (req, res) => {
	ChatMessage.find({chat: req.params.chatId}).populate('user').then(chats => {
		res.status(200).json(chats);
	}).catch(e => {
		res.status(500).json({error: e.message});
	});
};

module.exports = {
  getPublicChatMessages,
  createPrivateChatMessage,
  createPublicChatMessage,
  getPrivateChatMessages
};
