const Picture = require("../../models/system_configuration/Picture");

const getAllPicture = async (req, res) => {
  try {
    const pictures = await Picture.find({});
    res.status(200).send(pictures);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addPicture = async (req, res) => {};

const editPicture = async (req, res) => {};

const deletePicture = async (req, res) => {
  try {
    await Picture.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Picture Deleted Successfully",
    });
  } catch (err) {
    es.status(500).send({
      message: err.message,
    });
  }
};

const getSinglePicture = async (req, res) => {
  try {
    const picture = await Picture.findById(req.params.id);
    res.status(200).send(picture);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  getAllPicture,
  addPicture,
  editPicture,
  deletePicture,
  getSinglePicture,
};
