const mongoose = require("mongoose");

const carouselSchema = mongoose.Schema(
  {
    pictureName: {
      type: String,
      required: true,
    },
    backGroundImage: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    sort: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Carousel = mongoose.model("Carousel", carouselSchema);
module.exports = Carousel;
