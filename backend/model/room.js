const mongoose  = require('mongoose')
const schema = mongoose.Schema



const mem_schema = new schema({
  room: {
    type: String,
    required: [true, "please choose a job title"],
  },

  member: {
    type: Array
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const mem_mode = mongoose.model('room', mem_schema)
module.exports = mem_mode;