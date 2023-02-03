const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	body: { type: String, required: true},
    // usuario que envia el mensaje
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    // el ID del chat al que pertenece el usuario
	chat: {type: mongoose.Schema.Types.ObjectId,ref: 'Chat', required: true}
}, {timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});


const ChatMessage = mongoose.model('ChatMessage', schema);



module.exports = ChatMessage;
