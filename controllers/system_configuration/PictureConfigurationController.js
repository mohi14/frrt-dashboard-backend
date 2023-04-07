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

const addPicture = async (req, res) => {
  try {
    const newPicture = new Picture(req.body);
    const result = await newPicture.save();
    if (result) {
      res.status(200).send({ message: "Picture Created Successfully" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const editPicture = async (req, res) => {
  try {
    const picture = await Picture.findById(req.params.id);
    if (picture) {
      const updatepicture = req.body;
      const result = await Picture.updateOne(
        { _id: req.params.id },
        updatepicture,
        {
          new: true,
        }
      );
      if (result) {
        res.status(200).send({ message: "picture updated successfully" });
      }
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateProjectLogo = async (req, res) => {
  try {
    const logo = await Picture.findById(req.params.id);
    if (logo) {
      const result = await Picture.updateOne(
        { _id: req.params.id },
        {
          $set: {
            projectLogo: req.body.projectLogo,
          },
        }
      );
      if (result) {
        res.status(200).send({ message: "Project Logo updated successfully" });
      }
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const updateCurrenciesIcon = async (req, res) => {
  try {
    const icon = await Picture.findById(req.params.id);
    if (icon) {
      const result = await Picture.updateOne(
        { _id: req.params.id },
        {
          $set: {
            currenciesIcon: req.body.currenciesIcon,
          },
        }
      );
      if (result) {
        res
          .status(200)
          .send({ message: "Currencies Icon updated successfully" });
      }
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

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

const deleteAll = async (req, res) => {
  await Picture.deleteMany({});
  res.send({ message: "delete" });
};

module.exports = {
  getAllPicture,
  addPicture,
  editPicture,
  deletePicture,
  getSinglePicture,
  updateProjectLogo,
  updateProjectLogo,
  updateCurrenciesIcon,
  deleteAll,
};
