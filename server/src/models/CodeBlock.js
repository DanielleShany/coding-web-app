const mongoose = require('mongoose');

const codeBlockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, default: '' }, // Store the code content
});

module.exports = mongoose.model('CodeBlock', codeBlockSchema);
