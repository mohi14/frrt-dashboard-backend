const mongoose = require("mongoose");

const pictureSchema = mongoose.Schema(
  {
    projectLogo: {
      type: String,
      required: false,
    },
    // userAvatar: {
    //   type: String,

    //   default: "jkdfjkas",
    // },
    // userBanner: {
    //   type: String,

    //   default: "jkdfjkas",
    // },
    // helpCenterBanner: {
    //   type: String,

    //   default: "jkdfjkas",
    // },
    currenciesIcon: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Picture = mongoose.model("Picture", pictureSchema);
module.exports = Picture;
