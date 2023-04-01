const mongoose = require('mongoose');

const SupportContentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  title: { type: String, required: true },
  category: {type: String, required: true},
  walletAddress: { type: String, required: true },
  chain: { type: String, required: true },
  description: { type: String, required: true },
  attachedDocument: { type: String }
});

const MyModel = mongoose.model('SupportContent', SupportContentSchema);

module.exports = MyModel;
