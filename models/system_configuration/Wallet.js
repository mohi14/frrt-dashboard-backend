const mongoose = require("mongoose");

const walletSchema = mongoose.Schema(
  {
    walletName: {
      type: String,
      required: true,
    },
    walletIcon: {
      type: String,
      required: true,
    },
    isSupported: {
      type: Boolean,
      required: true,
    },
    IOSJumpLink: {
      type: String,
      required: true,
    },
    IOSDownloadLink: {
      type: String,
      required: true,
    },
    androidJumpLink: {
      type: String,
      required: true,
    },
    androidDownloadLink: {
      type: String,
      required: true,
    },
    canIWakeUp: {
      type: Boolean,
      required: true,
    },
    sort: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
