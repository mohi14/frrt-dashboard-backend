const mongoose = require("mongoose");

const mailSchema = mongoose.Schema(
  {
    account: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    port: {
      type: Number,
      required: true,
    },
    senderServer: {
      type: String,
      required: true,
    },

    receivingServer: {
      type: String,
      required: true,
    },
    whetherTheDefault: {
      type: Boolean,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Mail = mongoose.model("Mail", mailSchema);
module.exports = Mail;
