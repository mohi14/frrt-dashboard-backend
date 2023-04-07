const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    chainName: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    tokenType: {
      type: String,
      required: true,
    },
    contractAddress: {
      type: String,
      required: true,
    },
    accuracy: {
      type: Number,
      required: true,
    },
    sort: {
      type: Number,
      required: true,
    },
    usdChangeRate: {
      type: Number,
      reruired: true,
    },
    status: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
