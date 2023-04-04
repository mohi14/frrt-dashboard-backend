const mongoose = require("mongoose");

const pictureSchema = mongoose.Schema(
  {
    projectLogo: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
      required: true,
    },
    userBanner: {
      type: String,
      required: true,
    },
    helpCenterBanner: {
      type: String,
      required: true,
    },
    currencies: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Picture = mongoose.model("Picture", pictureSchema);
module.exports = Picture;
