const Chat = require("../models/chat");
const User = require("../models/User");
const server = require("../index");

//GET ALL
exports.getAll = (req, res) => {
    // recuperamos todos los chats y sacamos el id del user
    // de la key que configuramos con el authMiddleware
  Chat.find({ users: req.jwtPayload.id })
    .populate("users")
    .then((chats) => {
      res.status(200).json(chats);
    })
    .catch((e) => {
      res.status(500).json({ error: e.message });
    });
};

exports.getOne = (req, res) => {
  Chat.findById(req.params.id)
    .then((chat) => {
      res.status(200).json(chat);
    })
    .catch((e) => {
      res.status(500).json({ error: e.message });
    });
};

exports.createOne = (req, res) => {
  const authUser = req.jwtPayload;
  const newChatMembers = req.body.chatMembers;
  if (
    newChatMembers === undefined ||
    !newChatMembers instanceof Array ||
    newChatMembers.length === 0
  ) {
    res.status(500).json({ error: "A chat needs members" });
  } else {
    //filter duplicates
    const noDuplicatesMembers = newChatMembers.reduce(
      (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
      []
    );

    // missing control to prevent double chats

    // agregamos al usuario (que postea esto) al array de miembros del chat
    const chat = new Chat({ users: [...noDuplicatesMembers, authUser.id] });
    chat
      .save()
      .then((newChat) => {
        // como no podemos "popular" el campo de users desde el .save()
        // buscamos los usuarios y los añadimos a la response
        User.find({
          _id: {
            $in: newChat.users,
          },
        }).then((users) => {
          newChat.users = users;
          // users.filter(u => u._id !== req.user.id).forEach(user => {
          // 	server.ioPrivate.to(`user-${user._id}`).emit("new-chat", newChat);
          // })
          res.status(201).json(newChat);
        });
      })
      .catch((e) => {
        res.status(500).json({ error: e.message });
      });
  }
};

exports.deleteOne = (req, res) => {
  Chat.deleteOne({ _id: req.params.id })
    .then((result) => res.status(204))
    .catch((e) => res.status(500).json({ error: e.message }));
};
