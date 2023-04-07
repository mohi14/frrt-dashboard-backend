const Carousel = require("../../models/system_configuration/Carousel");

const getAllCarousel = async (req, res) => {
  try {
    const { pictureName } = req.query;
    const filter = {};
    if (filter) {
      filter.pictureName = { $regex: pictureName, $options: "i" };
    }
    const carousel = await Carousel.find(filter);
    res.status(200).send(carousel);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addCarousel = async (req, res) => {
  try {
    const newCarousel = new Carousel(req.body);
    const result = await newCarousel.save();
    if (result) {
      res.status(200).send({ message: "Carousel Created Successfully" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const editCarousel = async (req, res) => {
  try {
    const carousel = await Carousel.findById(req.params.id);
    if (carousel) {
      const updateCarousel = req.body;
      const result = await Carousel.updateOne(
        { _id: req.params.id },
        updateCarousel,
        {
          new: true,
        }
      );
      if (result) {
        res.status(200).send({ message: "Carousel updated successfully" });
      }
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

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

const updateCarouselStatus = async (req, res) => {
  try {
    const carousel = await Carousel.findById(req.params.id);
    if (carousel) {
      const result = await Carousel.updateOne(
        { _id: req.params.id },
        {
          $set: {
            status: req.body.status,
          },
        }
      );
      res.status(200).send({ message: "status updated successfully" });
    }
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
  updateCarouselStatus,
};
