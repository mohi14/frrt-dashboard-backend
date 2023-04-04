const Carousel = require("../../models/system_configuration/Carousel");

const getAllCarousel = async (req, res) => {
  try {
    const carousel = await Carousel.find({});
    res.status(200).send(carousel);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addCarousel = async (req, res) => {};

const editCarousel = async (req, res) => {};

const deleteCarousel = async (req, res) => {
  try {
    await Carousel.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Carousel Deleted Successfully",
    });
  } catch (err) {
    es.status(500).send({
      message: err.message,
    });
  }
};

const getSingleCarousel = async (req, res) => {
  try {
    const carousel = await Carousel.findById(req.params.id);
    res.status(200).send(carousel);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  getAllCarousel,
  addCarousel,
  editCarousel,
  deleteCarousel,
  getSingleCarousel,
};
