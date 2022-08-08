const mongoose = require("mongoose");
const schema = mongoose.Schema;

const mem_schema = new schema({
  roomQ: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "room",
  },

  chat: {
    type: String,
  },

  senderid: {
        type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const mem_mode = mongoose.model("chat", mem_schema);
module.exports = mem_mode;
