const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const messageSchema = new Schema(
  {
    chatId: {
      type: Array,
    },
    senderId: {
      type: String,
    },

    text: { type: String },
  },
  {
    timestamps: true,
  }
);
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
