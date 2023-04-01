const jwt = require('jsonwebtoken');
const BaseController = require('../BaseController');
const UserModel = require("../../models/User").User;
const SoldModel = require('../../models/Sold').Sold;
const EventModel = require('../../models/Event').Event;
const BidModel = require('../../models/Bid').Bid;
const ItemModel = require('../../models/Item').Item;
const FractionModel = require('../../models/Fraction').Fraction;
const CommodityModel = require('../../models/Commodity');
const CollectionModel = require('../../models/Collection').Collection;
const NotificationModel = require('../../models/NotificationSwitch');

const e_profilePic = process.env.AVATAR_IMG;
const e_profileCover = process.env.COVER_IMG;
const e_jwtToken = process.env.JWT_TOKEN;
const e_pageLimit = parseInt(process.env.PAGE_LIMIT);

module.exports = BaseController.extend({
  name: "CommodityController",
  commodityList: async function (req, res, next) {
    try {
      const { owner, name, category } = req.query;
      const filter = {};

      if (owner) {
        filter.owner = owner;
      }

      if (name) {
        filter.name = { $regex: name, $options: "i" };
      }

      if (category) {
        filter.category = category;
      }
      const pageNumber = parseInt(req.query.pageNumber) || 1; // Set default page number to 1
      const resultsPerPage = 10;

      CommodityModel.find(filter)
        .skip((pageNumber - 1) * resultsPerPage)
        .limit(resultsPerPage)
        .exec(function (err, results) {
          if (err) {
            res.status(404);
          } else {
            res.json(results);
          }
        });
    } catch (err) {
      res.status(204).json({ message: err.message });
    }
  },
  createCommodity: async function (req, res, next) {
    try {
      const postData = req.body;
  
      // Check for null values in the request body
      if (!postData.name || !postData.description || !postData.price || !postData.category || !postData.owner) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const { error } = CommodityModel.validate(postData);
      if (error) throw new Error(error.message);
      const newCommodityData = {
        name: postData.name,
        description: postData.description,
        imageURI: e_profilePic,
        price: postData.price,
        category: postData.category,
        owner: postData.owner,
      };
  
      const newCommodity = new CommodityModel(newCommodityData);
      await newCommodity.save();
  
      res.status(201).json({
        message: "commodity created",
        data: newCommodity,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },
});
