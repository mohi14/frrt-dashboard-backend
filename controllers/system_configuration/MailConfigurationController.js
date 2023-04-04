const Mail = require("../../models/system_configuration/Mail");

const getAllMail = async (req, res) => {
  try {
    const mails = await Mail.find({});
    res.status(200).send(mails);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addMail = async (req, res) => {};

const editMail = async (req, res) => {};

const deleteMail = async (req, res) => {
  try {
    await Mail.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Mail Deleted Successfully",
    });
  } catch (err) {
    es.status(500).send({
      message: err.message,
    });
  }
};

const getSingleMail = async (req, res) => {
  try {
    const mail = await Mail.findById(req.params.id);
    res.status(200).send(mail);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  getAllMail,
  addMail,
  editMail,
  deleteMail,
  getSingleMail,
};
