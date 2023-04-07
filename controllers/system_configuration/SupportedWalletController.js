const Wallet = require("../../models/system_configuration/Wallet");

const getAllWallet = async (req, res) => {
  try {
    const { walletName } = req.query;
    const filter = {};
    if (walletName) {
      filter.walletName = { $regex: walletName, $options: "i" };
    }
    const wallet = await Wallet.find(filter);
    res.status(200).send(wallet);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addWallet = async (req, res) => {
  try {
    const newWallet = new Wallet(req.body);
    const result = await newWallet.save();
    if (result) {
      res.status(200).send({ message: "Wallet Created Successfully" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const editWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findById(req.params.id);
    if (wallet) {
      const updatewallet = req.body;
      const result = await Wallet.updateOne(
        { _id: req.params.id },
        updatewallet,
        {
          new: true,
        }
      );
      if (result) {
        res
          .status(200)
          .send({ message: "Wallet configuration updated successfully" });
      }
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

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
