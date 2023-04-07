const Transaction = require("../../models/system_configuration/Transaction");

const getAllTranSactions = async (req, res) => {
  try {
    const { chainName, token, tokenType, contractAddress, status } = req.query;
    const filter = {};
    if (chainName) {
      filter.chainName = { $regex: chainName, $options: "i" };
    }
    if (token) {
      filter.token = { $regex: token, $options: "i" };
    }
    if (tokenType) {
      filter.tokenType = { $regex: tokenType, $options: "i" };
    }
    if (contractAddress) {
      filter.contractAddress = { $regex: contractAddress, $options: "i" };
    }
    if (status) {
      filter.status = status === "false" ? false : true;
    }
    const transactions = await Transaction.find(filter);
    res.status(200).send(transactions);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addTranSactions = async (req, res) => {
  try {
    const newTranSaction = new Transaction(req.body);
    const result = await newTranSaction.save();
    if (result) {
      res.status(200).send({ message: "Transaction Created Successfully" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const editTranSactions = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction) {
      const updateTransaction = req.body;
      const result = await Transaction.updateOne(
        { _id: req.params.id },
        updateTransaction,
        {
          new: true,
        }
      );
      if (result) {
        res.status(200).send({ message: "transaction updated successfully" });
      }
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

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

const updateStatus = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction) {
      const result = await Transaction.updateOne(
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
  getAllTranSactions,
  addTranSactions,
  editTranSactions,
  deleteTranSactions,
  getSingleTranSactions,
  updateStatus,
};
