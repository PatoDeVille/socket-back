const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    body: String,
    from: String,
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
    },
  }
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
