const Transaction = require("../../models/system_configuration/Transaction");

const getAllTranSactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    res.status(200).send(transactions);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addTranSactions = async (req, res) => {};

const editTranSactions = async (req, res) => {};

const deleteTranSactions = async (req, res) => {
  try {
    await Transaction.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Transaction Deleted Successfully",
    });
  } catch (err) {
    es.status(500).send({
      message: err.message,
    });
  }
};

const getSingleTranSactions = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    res.status(200).send(transaction);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  getAllTranSactions,
  addTranSactions,
  editTranSactions,
  deleteTranSactions,
  getSingleTranSactions,
};
