const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  complete: { type: Boolean, required: false },
  completedOn: { type: Date, required: false },
  createdOn: { type: Date, required: false },
});

module.exports = mongoose.model("Todo", TodoSchema);
