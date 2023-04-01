const BaseController = require('../BaseController');
const AuctionModel = require('../../models/Auction')
const UserModel = require('../../models/User').User;


const createAuction = async function (req, res, next) {
  try {
    const {
      name,
      id,
      contractAddress,
      chain,
      owner,
      category,
      contractCurrency,
      tokenStardard,
      status,
      creationTime,
      chained,
      isReleased,
      groupId,
      externalUrl,
      description,
      creator,
      updateTime,
      TradingTime,
      salesTime,
      previewURL,

    } = req.body;

    if(!name || !id || !contractAddress || !chain || !owner || !category || !contractCurrency || !tokenStardard || !status || !creationTime || !chained || !isReleased || !groupId || !creator || !updateTime || !TradingTime || !salesTime) {
      return res.send({status: 'error', message: 'Please provide all required fields'});
    }

    const auction = new AuctionModel({
      id,
      name,
      contractAddress,
      chain,
      owner,
      category,
      contractCurrency,
      tokenStardard,
      status,
      creationTime,
      chained,
      isReleased,
      groupId,
      externalUrl,
      description,
      creator,
      updateTime,
      TradingTime,
      salesTime,
      previewURL,
    });
  
    await auction.save();
    return res.send({status: 'success', message: 'Auction created successfully', auction: auction});
  } catch (error) {
    return res.send({status: 'error', message: 'Something went wrong', error: error});
  }
}


const updateAuction = async function (req, res, next) {
  try {
    const updateInfo = req.body;

    if(!updateInfo.id) {
      return res.send({status: 'error', message: 'Please provide all required fields'});
    }

    const updatedAuction = await AuctionModel.updateOne(
      {id: updateInfo.id},
      { $set: updateInfo }
    );

    return res.send({status: 'success', message: 'Auction updated successfully', auction: updatedAuction});
  } catch (error) {
    return res.send({status: 'error', message: 'Something went wrong', error: error});
  }
}

const getAllAuctions = async function (req, res, next) {
  try {
    const auctions = await AuctionModel.find();
    return res.send({status: 'success', message: 'Auctions fetched successfully', auctions: auctions});
  } catch (error) {
    return res.send({status: 'error', message: 'Something went wrong', error: error});
  }
}

const getAuctionsById = async function (req, res, next) {
  try {
    const auctions = await AuctionModel.find({id: req.params.id});
    return res.send({status: 'success', message: 'Auctions fetched successfully', auctions: auctions});
  } catch (error) {
    return res.send({status: 'error', message: 'Something went wrong', error: error});
  }
}



module.exports = BaseController.extend({
    name: 'CollectionController',
    createAuction: createAuction,
    updateAuction: updateAuction,
    getAllAuctions: getAllAuctions,
    getAuctionsById: getAuctionsById,
});
