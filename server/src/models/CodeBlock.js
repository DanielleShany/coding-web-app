const mongoose = require('mongoose');

const codeBlockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, default: '' }, //content
  solution: { type: String, default: '' }, //solution
});

module.exports = mongoose.model('CodeBlock', codeBlockSchema);
