const Wallet = require("../../models/system_configuration/Wallet");

const getAllWallet = async (req, res) => {
  try {
    const wallet = await Wallet.find({});
    res.status(200).send(wallet);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addWallet = async (req, res) => {};

const editWallet = async (req, res) => {};

const deleteWallet = async (req, res) => {
  try {
    await Wallet.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Wallet Deleted Successfully",
    });
  } catch (err) {
    es.status(500).send({
      message: err.message,
    });
  }
};

const getSingleWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findById(req.params.id);
    res.status(200).send(wallet);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  getAllWallet,
  addWallet,
  editWallet,
  deleteWallet,
  getSingleWallet,
};
