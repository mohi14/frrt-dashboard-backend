const BaseController = require('../BaseController');
const CollectionModel = require("../../models/Collection").Collection;
const UserModel = require('../../models/User').User;

const e_profilePic = process.env.AVATAR_IMG;
const e_profileCover = process.env.COVER_IMG;
const e_pageLimit = parseInt(process.env.PAGE_LIMIT);

module.exports = BaseController.extend({
    name: 'CollectionController',
    get: async function (req, res, next) {
        let query = {$or: [{owner: req.query.owner}, {isPublic: true}]};
        let collections = await CollectionModel.find(query);
        if (!collections) return res.send({status: 'error', message: 'No collections found', collections: []});
        return res.send({status: 'success', collections: collections});
    },
    isExist: async function (req, res, next) {
        let collections = await CollectionModel.find({name: req.query.name});
        if (!collections || collections.length === 0) return res.status(404).send({message: "No collections found"});
        return res.status(200).send({collections: collections})
    },
    detail: async function (req, res, next) {
        let collectionAddr = req.params.address ? req.params.address.toLowerCase() : "none";
        let collection = await CollectionModel.findOne({address: collectionAddr}, {__v: 0, _id: 0});
        if (!collection) return res.status(404).send({message: "No collections found"});
        return res.status(200).send({collection: collection});
    },
    getAll: async function (req, res, next) {
        let page = parseInt(req.query.page) || 1;
        let pageLimit = parseInt(req.query.pageLimit) || e_pageLimit;
        let collections = await CollectionModel.find({}, {_id: 0, __v: 0})
            .skip((page - 1) * pageLimit).limit(pageLimit).lean();
        for (let i = 0; i < collections.length; i++) {
            let checkOwner = await UserModel.findOne({address: collections[i].owner}, {_id: 0, __v: 0}).lean();
            if (collections[i].owner !== "0x" && collections[i].owner !== "0x0000000000000000000000000000000000000000" && !checkOwner) {
                let newOwner = new UserModel({
                    address: collections[i].owner,
                    name: "NoName",
                    profilePic: e_profilePic,
                    profileCover: e_profileCover,
                    isApproved: false,
                    call_status: false,
                    call_time: (Date.now() / 1000),
                    nonce: Math.floor(Math.random() * 1000000)
                });
                await newOwner.save();
                checkOwner = newOwner;
            }
            collections[i].ownerUser = checkOwner;
        }
        return res.status(200).send({collections: collections});
    },
    hotCollections: async function (req, res, next) {
        const collections = await CollectionModel.find({}, {__v: 0, _id: 0}).sort({timestamp: -1}).limit(3).lean();
        for (let i = 0; i < collections.length; i++) {
            let checkOwner = await UserModel.findOne({address: collections[i].owner}, {_id: 0, __v: 0}).lean();
            if (collections[i].owner !== "0x" && collections[i].owner !== "0x0000000000000000000000000000000000000000" && !checkOwner) {
                let newOwner = new UserModel({
                    address: collections[i].owner,
                    name: "NoName",
                    profilePic: e_profilePic,
                    profileCover: e_profileCover,
                    isApproved: false,
                    call_status: false,
                    call_time: (Date.now() / 1000),
                    nonce: Math.floor(Math.random() * 1000000)
                });
                await newOwner.save();
                checkOwner = newOwner;
            }
            collections[i].ownerUser = checkOwner;
        }
        return res.status(200).send({collections: collections});
    },
    userCollections: async function (req, res, next) {
        let userAddr = req.params.address ? req.params.address.toLowerCase() : "none";
        if (userAddr === "none") return res.status(200).send({collections: []});

        let page = parseInt(req.query.page) || 1;
        let pageLimit = parseInt(req.query.pageLimit) || e_pageLimit;
        let collections = await CollectionModel.find({}, {_id: 0, __v: 0})
            .skip((page - 1) * pageLimit).limit(pageLimit).lean();
        return res.status(200).send({collections: collections});
    },
    createCollection: async (req, res) => {
      try {
        const { address, name, symbol, image, description, isPublic } = req.body;
    
        if (!address || !name || !symbol || !description || !isPublic) {
          return res.status(400).json({ message: "Missing required fields" });
        }
    
        const newCollection = new CollectionModel({
          address,
          name,
          symbol,
          image,
          description,
          isPublic,
          timestamp: (new Date()).getTime(),
        });
    
        const savedCollection = await newCollection.save();
    
        res.status(201).json(savedCollection);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
    },
      collectionList: async function (req, res, next) {
        try {
          const { address, collector, commodityid } = req.query;
          const filter = {};
    
          if (address) {
            filter.address = address;
          }
    
          if (commodityid) {
            filter.name = { $regex: commodityid, $options: "i" };
          }
    
          if (collector) {
            filter.symbol = collector;
          }
    
          const pageNumber = parseInt(req.query.pageNumber) || 1; // Set default page number to 1
          const resultsPerPage = 10;
    
          CollectionModel.find(filter)
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
});
