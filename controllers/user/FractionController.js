const BaseController = require("../BaseController");
const UserModel = require("../../models/User").User;
const ItemModel = require("../../models/Item").Item;
const CollectionModel = require('../../models/Collection').Collection;
const FractionModel = require('../../models/Fraction').Fraction;
const HolderModel = require('../../models/Holder').Holder;
const BidderModel = require('../../models/Bidder').Bidder;
const e_fractionalAddr = process.env.FRACTIONALIZER_ADDR.toLowerCase();
const e_fractionalAuctionAddr = process.env.FRACTIONALIZER_AUCTION_ADDR.toLowerCase();
const e_profilePic = process.env.AVATAR_IMG;
const e_profileCover = process.env.COVER_IMG;
const e_pageLimit = parseInt(process.env.PAGE_LIMIT);

module.exports = BaseController.extend({
    name: "FractionController",
    getOne: async function (req, res, next) {
        const that = this;
        let owner = req.query.owner?.toLowerCase();
        let page = req.query.page || 1;
        if (!owner) return res.status(200).send({ items: [], count: 0 });
        let fractions = await HolderModel.aggregate([
            { $match: { account: owner } },
            {
                $lookup: {
                    from: 'fractions',
                    localField: 'fraction',
                    foreignField: 'address',
                    as: 'fraction'
                }
            },
            { $unwind: '$fraction' },
            {
                $project: {
                    id: 0,
                    __v: 0,
                    _id: 0,
                    "fraction.__v": 0,
                    "fraction._id": 0,
                }
            }
        ]).skip((page - 1) * e_pageLimit).limit(e_pageLimit);
        let ret = [];
        for (let i = 0; i < fractions.length; i++) {
            let node = fractions[i];
            // seller
            let seller = await UserModel.findOne({ address: node.fraction.seller }, { _id: 0, __v: 0 }).lean();
            if (node.fraction.seller !== "0x" && node.fraction.seller !== that.ZERO_ADDRESS && !seller) {
                const newUser = new UserModel({
                    address: node.seller.toLowerCase(),
                    name: "NoName",
                    profilePic: e_profilePic,
                    profileCover: e_profileCover,
                    isApproved: false,
                    call_status: false,
                    call_time: (Date.now() / 1000),
                    nonce: Math.floor(Math.random() * 1000000)
                });
                await newUser.save();
                node.seller = newUser;
            } else {
                node.seller = seller;
            }
            // Items
            node.item = await ItemModel.findOne({ itemCollection: node.fraction.target, tokenId: node.fraction.tokenId }, { __v: 0, _id: 0 }).lean();
            // Holders
            let holders = [];
            let holder_nodes = await HolderModel.find({ fraction: node.fraction.address }, { __v: 0, _id: 0 }).lean();
            for (let idx2 = 0; idx2 < holder_nodes.length; idx2++) {
                let holder_node = holder_nodes[idx2];
                let holder = await UserModel.findOne({ address: holder_node.account }, { _id: 0, __v: 0 }).lean();
                if (holder_node.account !== "0x" && holder_node.account !== that.ZERO_ADDRESS && !holder) {
                    const newUser = new UserModel({
                        address: holder_node.account.toLowerCase(),
                        name: "NoName",
                        profilePic: e_profilePic,
                        profileCover: e_profileCover,
                        isApproved: false,
                        call_status: false,
                        call_time: (Date.now() / 1000),
                        nonce: Math.floor(Math.random() * 1000000)
                    });
                    await newUser.save();
                    holder_node.holder = newUser;
                } else {
                    holder_node.holder = holder;
                }
                holders.push(holder_node);
            }
            node.holders = holders;
            ret.push(node);
        }
        let totalCount = await HolderModel.countDocuments({ account: owner });
        return res.status(200).send({ items: ret, count: totalCount });
    },
    get: async function (req, res, next) {
        const that = this;
        let queries = that.handleRequest(req, e_pageLimit);
        // console.log("get: ", queries);
        let fractions = await FractionModel.find(queries.query, { __v: 0, _id: 0 }).sort(queries.sort).limit(queries.limit).skip(queries.skip).lean();
        if (!fractions) return res.status(404).send({ message: "No items found" });
        let ret = [];
        for (let i = 0; i < fractions.length; i++) {
            let node = fractions[i];
            // seller
            let seller = await UserModel.findOne({ address: node.seller }, { _id: 0, __v: 0 }).lean();
            if (node.seller !== "0x" && node.seller !== that.ZERO_ADDRESS && !seller) {
                const newUser = new UserModel({
                    address: node.seller.toLowerCase(),
                    name: "NoName",
                    profilePic: e_profilePic,
                    profileCover: e_profileCover,
                    isApproved: false,
                    call_status: false,
                    call_time: (Date.now() / 1000),
                    nonce: Math.floor(Math.random() * 1000000)
                });
                await newUser.save();
                node.sellerUser = newUser;
            } else {
                node.sellerUser = seller;
            }
            // Items
            node.item = await ItemModel.findOne({ itemCollection: node.target, tokenId: node.tokenId }, { __v: 0, _id: 0 }).lean();
            // Holders
            let holders = [];
            let holder_nodes = await HolderModel.find({ fraction: node.address }, { __v: 0, _id: 0 }).lean();
            for (let idx2 = 0; idx2 < holder_nodes.length; idx2++) {
                let holder_node = holder_nodes[idx2];
                let holder = await UserModel.findOne({ address: holder_node.account }, { _id: 0, __v: 0 }).lean();
                if (holder_node.account !== "0x" && holder_node.account !== that.ZERO_ADDRESS && !holder) {
                    const newUser = new UserModel({
                        address: holder_node.account,
                        name: "NoName",
                        profilePic: e_profilePic,
                        profileCover: e_profileCover,
                        isApproved: false,
                        call_status: false,
                        call_time: (Date.now() / 1000),
                        nonce: Math.floor(Math.random() * 1000000)
                    });
                    await newUser.save();
                    holder_node.holder = newUser;
                } else {
                    holder_node.holder = holder;
                }
                holders.push(holder_node);
            }
            node.holders = holders;
            ret.push(node);
        }
        let totalCount = await FractionModel.countDocuments(queries.query);
        return res.status(200).send({ items: ret, count: totalCount });
    },
    detail: async function (req, res, next) {
        const that = this;
        let id = req.params.id.toLowerCase();
        let fraction = await FractionModel.findOne({ address: id }, { __v: 0, _id: 0 }).lean();
        if (!fraction) return res.status(404).send({ message: "No item found" });
        // seller
        let seller = await UserModel.findOne({ address: fraction.seller }, { _id: 0, __v: 0 }).lean();
        if (fraction.seller !== "0x" && fraction.seller !== that.ZERO_ADDRESS && !seller) {
            const newUser = new UserModel({
                address: fraction.seller.toLowerCase(),
                name: "NoName",
                profilePic: e_profilePic,
                profileCover: e_profileCover,
                isApproved: false,
                call_status: false,
                call_time: (Date.now() / 1000),
                nonce: Math.floor(Math.random() * 1000000)
            });
            await newUser.save();
            fraction.sellerUser = newUser;
        } else {
            fraction.sellerUser = seller;
        }
        // Items & Collection
        fraction.item = await ItemModel.findOne({ itemCollection: fraction.target, tokenId: fraction.tokenId }, { __v: 0, _id: 0 }).lean();
        fraction.collection = await CollectionModel.findOne({ address: fraction.target }, { __v: 0, _id: 0 }).lean();
        // Holders
        let holders = [];
        let holder_nodes = await HolderModel.find({ fraction: fraction.address }, { __v: 0, _id: 0 }).lean();
        for (let idx2 = 0; idx2 < holder_nodes.length; idx2++) {
            let holder_node = holder_nodes[idx2];
            let holder = await UserModel.findOne({ address: holder_node.account }, { _id: 0, __v: 0 }).lean();
            if (holder_node.account !== "0x" && holder_node.account !== that.ZERO_ADDRESS && !holder) {
                const newUser = new UserModel({
                    address: holder_node.account,
                    name: "NoName",
                    profilePic: e_profilePic,
                    profileCover: e_profileCover,
                    isApproved: false,
                    call_status: false,
                    call_time: (Date.now() / 1000),
                    nonce: Math.floor(Math.random() * 1000000)
                });
                await newUser.save();
                holder_node.holder = newUser;
            } else {
                holder_node.holder = holder;
            }
            holders.push(holder_node);
        }
        fraction.holders = holders;
        fraction.bidder = null
        let bidder = await BidderModel.findOne({id: id}, {__v: 0, _id: 0}).lean();
        if (bidder) fraction.bidder = bidder;
        return res.status(200).send({ fraction: fraction });
    },
    handleRequest: function (req) {
        const pageLimit = parseInt(req.query.pageLimit) || e_pageLimit;
        const page = req.query.page && parseInt(req.query.page) ? parseInt(req.query.page) : 1;
        let skip = (page - 1) * pageLimit;
        const sortBy = req.query.sortBy === "az" || req.query.sortBy === "za" ? "name" : "timestamp";
        const sortDir = req.query.sortBy === "az" || req.query.sortBy === "old" ? "asc" : "desc";
        delete req.query.pageLimit;
        delete req.query.page;
        delete req.query.sortBy;
        delete req.query.sortDir;

        let sort;
        if (sortBy === "name") sort = { name: sortDir };
        else if (sortBy === "price") sort = { price: sortDir };
        else sort = { timestamp: sortDir };

        if (req.query.owner) {
            req.query.targets = req.query.owner.toLowerCase();
            delete req.query.owner;
        }
        if (req.query.owned) req.query.itemOwner = req.query.owner.toLowerCase();
        delete req.query.owned;

        const saleType = req.query.saleType;
        delete req.query.saleType;

        if (saleType === 'fixed') req.query.flag = false;
        else if (saleType === 'auction') req.query.flag = true;
        else if (saleType === 'all') req.query['$or'] = [{flag: false}, {flag: true}];

        const searchTxt = req.query.searchTxt;
        delete req.query.searchTxt;
        if (searchTxt) {
            const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
            const searchRgx = rgx(searchTxt);
            req.query.name = { $regex: searchRgx, $options: "i" };
        }
        req.query.released = false;
        return { query: req.query, sort: sort, skip: skip, limit: pageLimit };
    },
});