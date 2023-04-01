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

const updateUserConfiguration = async function (req, res) {
    try {
    if(!req.body || !req.body.userId) return res.status(400).send({error: 'invalid params'});

    const updatedUser = await UserModel.updateOne(
        {userId: updateInfo.id},
        { $set: req.updateInfo }
      );

      return res.send({status: 'success', message: 'User updated successfully', user: updatedUser});
    } catch (error) {
      return res.send({status: 'error', message: 'Something went wrong', error: error});
    }
}

module.exports = BaseController.extend({
  name: "UserController",
  login: async function (req, res, next) {
    console.log("user login: ", req.body);
    let { address } = req.body;
    if (!address) return res.status(400).send({ error: "invalid params" });
    address = address.toLowerCase().trim();
    let user = await UserModel.findOne({ address: address });
    if (
      address !== "0x" &&
      address !== "0x0000000000000000000000000000000000000000" &&
      !user
    ) {
      const newUser = new UserModel({
        address: address,
        name: "NoName",
        profilePic: e_profilePic,
        profileCover: e_profileCover,
        isApproved: false,
        call_status: false,
        call_time: Date.now() / 1000,
        nonce: Math.floor(Math.random() * 1000000),
      });
      user = await newUser.save();
    } else {
      user.nonce = Math.floor(Math.random() * 1000000);
      user.last_login = new Date();
      await user.save();
    }
    let token = jwt.sign({ data: user.address }, e_jwtToken, {
      expiresIn: "43200m",
    }); // expireIn 1 month
    return res.status(200).send({ token: token });
  },
  check: async function (req, res, next) {
    const { address } = req.query;
    let user = await UserModel.findOne({
      address: address.toLowerCase().trim(),
    }).lean();
    if (!user || user.status !== "active") return res.sendStatus(404);
    return res.status(200).send(user);
  },
  get: async function (req, res, next) {
    let user_address = req.params.address.toLowerCase();
    let user = await UserModel.findOne(
      { address: user_address },
      { _id: 0, __v: 0 }
    );
    if (
      user_address !== "0x" &&
      user_address !== "0x0000000000000000000000000000000000000000" &&
      !user
    ) {
      const newUser = new UserModel({
        address: user_address,
        name: "NoName",
        profilePic: e_profilePic,
        profileCover: e_profileCover,
        isApproved: false,
        call_status: false,
        call_time: Date.now() / 1000,
        nonce: Math.floor(Math.random() * 1000000),
      });
      await newUser.save();
      return res.status(200).send({ user: newUser });
    } else res.status(200).send({ user: user });
  },
  update: async function (req, res, next) {
    if (!req.body.address)
      return res.status(400).send({ message: "No address" });
    let user = await UserModel.findOne({ address: req.body.address });
    if (!user) return res.status(400).send({ message: "User not found" });
    const name = req.body.name || user.name;
    const bio = req.body.bio || user.bio;
    const facebookLink = req.body.facebookLink || user.facebookLink;
    const twitterLink = req.body.twitterLink || user.twitterLink;
    const googleLink = req.body.googleLink || user.googleLink;
    const vineLink = req.body.vineLink || user.vineLink;
    const profilePic = req.body.profilePic || user.profilePic;
    const profileCover = req.body.profileCover || user.profileCover;
    await user.updateOne({
      name: name,
      bio: bio,
      facebookLink: facebookLink,
      twitterLink: twitterLink,
      googleLink: googleLink,
      vineLink: vineLink,
      profilePic: profilePic,
      profileCover: profileCover,
    });
    return res.status(200).send({ message: "Success update" });
  },
  getAuthors: async function (req, res, next) {
    let pageLimit = parseInt(req.query.pageLimit) || e_pageLimit;
    let page = parseInt(req.query.page) || 1;
    let authors = await UserModel.find(
      { address: { $ne: "0x" } },
      { _id: 0, __v: 0 }
    )
      .skip((page - 1) * pageLimit)
      .limit(pageLimit)
      .lean();
    return res.status(200).send({ authors: authors });
  },
  getSellers: async function (req, res, next) {
    let pageLimit = parseInt(req.query.pageLimit) || e_pageLimit;
    let page = parseInt(req.query.page) || 1;
    let sellers = await SoldModel.aggregate([
      {
        $group: {
          _id: { sellerAddress: "$to" },
          totalAmount: { $sum: "$price" },
          count: { $sum: 1 },
        },
      },
      { $limit: pageLimit },
      { $skip: (page - 1) * pageLimit },
      { $sort: { totalAmount: -1 } },
    ]);
    for (let i = 0; i < sellers.length; i++) {
      sellers[i].seller = await UserModel.findOne(
        { address: sellers[i]._id.sellerAddress },
        { _id: 0, __v: 0 }
      ).lean();
    }
    return res.status(200).send({ sellers: sellers });
  },
  activities: async function (req, res, next) {
    let pageLimit = parseInt(req.query.pageLimit) || e_pageLimit;
    let page = parseInt(req.query.page) || 1;
    let filter = req.query.filter || "recent";
    let filter_query = {};
    let bid = false;
    switch (filter) {
      case "mints":
        filter_query.name = "Minted";
        break;
      case "sales":
        filter_query["$or"] = [
          { name: "MarketListed" },
          { name: "AuctionListed" },
          { name: "MarketDelisted" },
          { name: "AuctionDelisted" },
        ];
        break;
      case "offers":
        filter_query["$or"] = [{ name: "MarketSold" }, { name: "AuctionSold" }];
        break;
      case "bids":
        bid = true;
        break;
      default:
        break;
    }
    let events;
    if (bid)
      events = await BidModel.find({}, { _id: 0, __v: 0 })
        .sort({ timestamp: -1 })
        .skip((page - 1) * pageLimit)
        .limit(pageLimit)
        .lean();
    else
      events = await EventModel.find(filter_query, { _id: 0, __v: 0 })
        .sort({ timestamp: -1 })
        .skip((page - 1) * pageLimit)
        .limit(pageLimit)
        .lean();
    for (let i = 0; i < events.length; i++) {
      let fromUser = await UserModel.findOne(
        { address: events[i].from },
        { _id: 0, __v: 0 }
      ).lean();
      let toUser = await UserModel.findOne(
        { address: events[i].to },
        { _id: 0, __v: 0 }
      ).lean();
      if (fromUser) events[i].fromUser = fromUser;
      if (toUser) events[i].toUser = toUser;
      events[i].item = await ItemModel.findOne(
        {
          itemCollection: events[i].itemCollection,
          tokenId: events[i].tokenId,
        },
        { _id: 0, name: 1, mainData: 1 }
      ).lean();
    }
    return res.status(200).send({ events: events });
  },
  userActivities: async function (req, res, next) {
    let user = req.query.user;
    if (!user) return;
    user = user.toLowerCase();
    let page = parseInt(req.query.page) || 1;
    let events = await EventModel.find({ $or: [{ from: user }, { to: user }] })
      .sort({ timestamp: -1 })
      .skip((page - 1) * e_pageLimit)
      .limit(e_pageLimit)
      .lean();
    for (let i = 0; i < events.length; i++) {
      let fromUser = await UserModel.findOne(
        { address: events[i].from },
        { _id: 0, __v: 0 }
      ).lean();
      let toUser = await UserModel.findOne(
        { address: events[i].to },
        { _id: 0, __v: 0 }
      ).lean();
      if (fromUser) events[i].fromUser = fromUser;
      if (toUser) events[i].toUser = toUser;
      if (events[i].tokenId === -1) {
        let fraction = await FractionModel.findOne(
          { address: events[i].itemCollection },
          { _id: 0, __v: 0 }
        ).lean();
        let item = null;
        if (fraction)
          item = await ItemModel.findOne(
            { itemCollection: fraction.target, tokenId: fraction.tokenId },
            { _id: 0, __v: 0 }
          ).lean();
        events[i].fraction = fraction;
        events[i].item = item;
      } else
        events[i].item = await ItemModel.findOne(
          {
            itemCollection: events[i].itemCollection,
            tokenId: events[i].tokenId,
          },
          { _id: 0, name: 1, mainData: 1 }
        ).lean();
    }
    return res.status(200).send({ items: events });
  },
  checkApproved: async function (req, res, next) {
    let address = req.params.address.toLowerCase();
    let account = await UserModel.findOne({
      address: address.toLowerCase(),
      isApproved: true,
    });
    if (account)
      return res.send({ status: "success", message: "This user is Approved" });
    else
      return res.send({
        status: "error",
        message: "This user is unauthorized",
      });
  },
  userList: async function (req, res, next) {
    try {
      //date format yyyy-mm-dd
      const { chain, name, wallet, sDate, eDate } = req.query;
      const filter = {};

      if (chain) {
        filter.chain = chain;
      }

      if (name) {
        filter.name = { $regex: name, $options: "i" };
      }

      if (wallet) {
        filter.address = wallet;
      }

      // if (sDate) {
      //   filter.last_login = { $gte: new Date(sDate) };
      // }

      // if (eDate) {
      //   filter.last_login = { $lte: new Date(eDate) };
      // }

      // if (sDate && eDate) {
      //   filter.last_login = {
      //     last_login: { $gte: new Date(sDate), $lte: new Date(eDate) },
      //   };
      // }
      const pageNumber = parseInt(req.query.pageNumber) || 1; // Set default page number to 1
      const resultsPerPage = 10;

      UserModel.find(filter)
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
  createUser: async function (req, res, next) {
    try {
      const {
        address,
        nonce,
        name,
        bio,
        facebook,
        twitter,
        google,
        profilePic,
        coverPic,
        isApproved,
        callStatus,
        callTime,
      } = req.body;

      // Check for null values in request
      if (!address || !nonce || !name) {
        return res
          .status(400)
          .json({ message: "Address, nonce, and name are required fields" });
      }

      const user = new UserModel({
        address,
        nonce,
        name,
        bio,
        facebookLink: facebook,
        twitterLink: twitter,
        googleLink: google,
        profilePic,
        profileCover: coverPic,
        isApproved,
        call_status: callStatus,
        call_time: callTime,
      });

      const newUser = await user.save();

      res.status(200).json({
        message: "User created",
        data: newUser,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  notificationSwitch: async function (req, res, next) {
    try {
      const { user, eventtype } = req.query;
      const filter = {};

      if (user) {
        filter.user = user;
      }

      if (eventtype) {
        filter.eventType = { $regex: eventtype, $options: "i" };
      }

      const pageNumber = parseInt(req.query.pageNumber) || 1; // Set default page number to 1
      const resultsPerPage = 10;

      NotificationModel.find(filter)
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
  createNotificationSwitch: async (req, res) => {
    const { user, eventtype, status } = req.body;

    // check for null values
    if (!user || !eventtype || !status) {
      return res
        .status(400)
        .json({ message: "Invalid request, missing required parameters" });
    }

    try {
      const newNotification = new NotificationModel({
        user,
        eventType: eventtype,
        enabled: status,
      });

      const savedNotification = await newNotification.save();

      res.status(201).json(savedNotification);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  },
});
