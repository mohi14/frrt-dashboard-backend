const BaseController = require("../BaseController");
const UserModel = require("../../models/User").User;
const ItemModel = require("../../models/Item").Item;
const PairModel = require("../../models/Pair").Pair;
const CollectionModel = require("../../models/Collection").Collection;
const AuctionModel = require("../../models/Auction").Auction;
const BidModel = require("../../models/Bid").Bid;
const EventModel = require("../../models/Event").Event;
const CategoryModel = require("../../models/Category").Category;

const e_marketAddr = process.env.MARKET_ADDR.toLowerCase();
const e_auctionAddr = process.env.AUCTION_ADDR.toLowerCase();
const e_profilePic = process.env.AVATAR_IMG;
const e_profileCover = process.env.COVER_IMG;
const e_pageLimit = parseInt(process.env.PAGE_LIMIT);

module.exports = BaseController.extend({
    name: "ItemController",
    get: async function (req, res, next) {
        let data = this.handleGetRequest(req, e_pageLimit);
        // console.log("get: ", data);
        let items = await ItemModel.find(data.query, { __v: 0, _id: 0 }).sort(data.sort).limit(data.limit).skip(data.skip).lean();
        if (!items) return res.status(404).send({ message: "No items found" });
        let ret = [];
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            // let owner = item.owner;
            if (item.itemOwner === e_marketAddr) {
                // marketplace item
                let pair = await PairModel.findOne({ tokenId: item.tokenId, itemCollection: item.itemCollection, bValid: true }, { _id: 0, __v: 0 }).lean();
                if (pair) item.pair = pair;
            } else if (item.itemOwner === e_auctionAddr) {
                // auction item
                let auction = await AuctionModel.findOne({ tokenId: item.tokenId, itemCollection: item.itemCollection, active: true }, { _id: 0, __v: 0 }).lean();
                if (auction) {
                    auction.price = auction.startPrice;
                    let bids = await BidModel.find({ auctionId: auction.id }, { _id: 0, __v: 0 }).sort({ bidPrice: -1 }).lean();
                    auction.bids = bids;
                    if (bids.length > 0) auction.price = bids[0].bidPrice;
                    item.auction = auction;
                }
            }
            // set item creator
            let creator = await UserModel.findOne({ address: item.creator }, { _id: 0, __v: 0 }).lean();
            if (item.creator !== "0x" && item.creator !== "0x0000000000000000000000000000000000000000" && !creator) {
                const newUser = new UserModel({
                    address: item.creator.toLowerCase(),
                    name: "NoName",
                    profilePic: e_profilePic,
                    profileCover: e_profileCover,
                    isApproved: false,
                    call_status: false,
                    call_time: (Date.now() / 1000),
                    nonce: Math.floor(Math.random() * 1000000)
                });
                await newUser.save();
                item.creatorUser = newUser;
            } else {
                item.creatorUser = creator;
            }
            // set item owner
            let ownerUserItem = await UserModel.findOne({ address: item.owner }, { _id: 0, __v: 0 }).lean();
            if (item.owner !== "0x" && item.owner !== "0x0000000000000000000000000000000000000000" && !ownerUserItem) {
                const newUser = new UserModel({
                    address: item.owner,
                    name: "NoName",
                    profilePic: e_profilePic,
                    profileCover: e_profileCover,
                    isApproved: false,
                    call_status: false,
                    call_time: (Date.now() / 1000),
                    nonce: Math.floor(Math.random() * 1000000)
                });
                await newUser.save();
                item.ownerUser = newUser;
            } else {
                item.ownerUser = ownerUserItem;
            }
            ret.push(item);
        }
        let totalCount = await ItemModel.countDocuments(data.query);
        return res.status(200).send({ items: ret, count: totalCount });
    },
    hotItems: async function (req, res, next) {
        let ret = [];
        const eventQuery = [
            {
                '$group': {
                    '_id': {
                        'itemCollection': '$itemCollection',
                        'tokenId': '$tokenId'
                    },
                    'totalActions': { $sum: 1 }
                }
            }
            , { '$sort': { 'totalActions': -1 } }
            , { '$limit': 7 }
        ];

        const idList = await EventModel.aggregate(eventQuery);
        if (idList && idList?.length > 0) {
            for (let index = 0; index < idList.length; index++) {
                let ItemId = idList[index];
                let tokenId = ItemId._id.tokenId;
                let itemCollection = ItemId._id.itemCollection;
                let item = await ItemModel.findOne({ tokenId: tokenId, itemCollection: itemCollection }, { _id: 0, __v: 0 }).lean();
                let creator = await UserModel.findOne({ address: item.creator }, { _id: 0, __v: 0 }).lean();
                if (item.creator !== "0x" && item.creator !== "0x0000000000000000000000000000000000000000" && !creator) {
                    let newUser = new UserModel({
                        address: item.creator,
                        name: "NoName",
                        profilePic: e_profilePic,
                        profileCover: e_profileCover,
                        isApproved: false,
                        call_status: false,
                        call_time: (Date.now() / 1000),
                        nonce: Math.floor(Math.random() * 1000000)
                    });
                    await newUser.save();
                    item.creatorUser = newUser;
                } else {
                    item.creatorUser = creator;
                }
                if (item.owner.toLowerCase() === e_auctionAddr) {
                    // auction item
                    let auction = await AuctionModel.findOne({ tokenId: tokenId, itemCollection: itemCollection, active: true }, { _id: 0, __v: 0 }).lean();
                    if (auction) item.auction = auction;
                }
                ret.push(item)
            }
        }
        if (ret.length > 0) return res.status(200).send({ items: ret, count: ret.length });
        else return res.status(404).send({ message: "No Hot items found" });
    },
    getBids: async function (req, res, next) {
        let ret = [];
        // Get auction item for higher number of bids
        const bidQuery = [
            { '$match': { 'from': req.params.address.toLowerCase() } }
            , {
                '$group': {
                    '_id': '$auctionId',
                    'price': { $max: '$bidPrice' },
                    'timestamp': { $max: '$timestamp' }
                }
            }
            , { '$sort': { 'price': -1 } }
        ];
        let bids = await BidModel.aggregate(bidQuery);
        for (let i = 0; i < bids.length; i++) {
            let bid = bids[i];
            let auction = await AuctionModel.findOne({ id: bid._id }, { _id: 0, __v: 0 }).lean();
            let maxBid = await BidModel.findOne({ auctionId: bid._id }, { _id: 0, __v: 0 }).sort({ bidPrice: -1 }).lean();
            auction.price = maxBid.bidPrice;
            auction.userPrice = bid.price;
            auction.userBidTimeStamp = bid.timestamp;
            let item = await ItemModel.findOne({ tokenId: auction.tokenId, itemCollection: auction.itemCollection }, { _id: 0, __v: 0 }).lean();
            if (item && item.itemStatus) {
                item.auction = auction;
                // set item creator
                let creator = await UserModel.findOne({ address: item.creator }, { _id: 0, __v: 0 }).lean();
                if (item.creator !== "0x" && item.creator !== "0x0000000000000000000000000000000000000000" && !creator) {
                    const newUser = new UserModel({
                        address: item.creator.toLowerCase(),
                        name: "NoName",
                        profilePic: e_profilePic,
                        profileCover: e_profileCover,
                        isApproved: false,
                        call_status: false,
                        call_time: (Date.now() / 1000),
                        nonce: Math.floor(Math.random() * 1000000)
                    });
                    await newUser.save();
                    item.creatorUser = newUser;
                } else {
                    item.creatorUser = creator;
                }
                ret.push(item);
            }
        }
        if (bids && bids?.length > 0) return res.status(200).send({ items: ret });
        else return res.status(404).send({ message: "No Bids found" });
    },
    detail: async function (req, res, next) {
        // console.log("Item details ...", req.params);
        let _collection = req.params.collection;
        let _tokenId = isNaN(parseInt(req.params.tokenId)) ? -1 : parseInt(req.params.tokenId);
        let item = await ItemModel.findOne({ tokenId: _tokenId, itemCollection: _collection }, { __v: 0, _id: 0 }).lean();
        if (!item) return res.status(404).send({ message: "No item found" });
        // set pair data
        let pair = await PairModel.findOne({ tokenId: _tokenId, itemCollection: _collection, bValid: true }, { _id: 0, __v: 0 }).lean();
        if (pair) item.pair = pair;
        // set auction data
        let auction = await AuctionModel.findOne({ tokenId: _tokenId, itemCollection: _collection, active: true }, { _id: 0, __v: 0 }).lean();
        if (auction) {
            auction.price = auction.startPrice;
            let bids = await BidModel.find({ auctionId: auction.id }, { _id: 0, __v: 0 }).sort({ bidPrice: -1 }).lean();
            if (bids.length > 0) {
                for (let index = 0; index < bids.length; index++) {
                    const bid = bids[index];
                    let fromUser = await UserModel.findOne({ address: bid.from }, { _id: 0, __v: 0 }).lean();
                    if (bid.from !== "0x" && bid.from !== "0x0000000000000000000000000000000000000000" && !fromUser) {
                        const newUser = new UserModel({
                            address: bid.from.toLowerCase(),
                            name: "NoName",
                            profilePic: e_profilePic,
                            profileCover: e_profileCover,
                            isApproved: false,
                            call_status: false,
                            call_time: (Date.now() / 1000),
                            nonce: Math.floor(Math.random() * 1000000)
                        });
                        await newUser.save();
                        bid.fromUser = newUser;
                    } else {
                        bid.fromUser = fromUser;
                    }
                }
                auction.price = bids[0].bidPrice;
                auction.bids = bids;
            }
            item.auction = auction;
        }
        // set transaction history data
        let events = await EventModel.find({ tokenId: _tokenId, itemCollection: _collection }, { _id: 0, __v: 0 }).sort({ timestamp: -1 }).lean();
        if (events.length > 0) {
            for (let index = 0; index < events.length; index++) {
                const event = events[index];
                let eventFrom = event.from.toLowerCase();
                let eventCollectionFrom = await CollectionModel.findOne({ address: eventFrom });
                if (eventFrom !== e_marketAddr && eventFrom !== e_auctionAddr && !eventCollectionFrom) {
                    let userFrom = await UserModel.findOne({ address: eventFrom }, { _id: 0, __v: 0 }).lean();
                    if (event.name !== "Minted" && eventFrom !== "0x" && eventFrom !== "0x0000000000000000000000000000000000000000" && !userFrom) {
                        const newUserFrom = new UserModel({
                            address: eventFrom,
                            name: "NoName",
                            profilePic: e_profilePic,
                            profileCover: e_profileCover,
                            isApproved: false,
                            call_status: false,
                            call_time: (Date.now() / 1000),
                            nonce: Math.floor(Math.random() * 1000000)
                        });
                        await newUserFrom.save();
                        event.userFrom = newUserFrom;
                    } else {
                        event.userFrom = userFrom;
                    }
                }
                let eventTo = event.to.toLowerCase();
                let eventCollectionTo = await CollectionModel.findOne({ address: eventTo });
                if (eventTo !== e_marketAddr && eventTo !== e_auctionAddr && !eventCollectionTo) {
                    let userTo = await UserModel.findOne({ address: eventTo }, { _id: 0, __v: 0 }).lean();
                    if (eventTo !== "0x" && eventTo !== "0x0000000000000000000000000000000000000000" && !userTo) {
                        const newUserTo = new UserModel({
                            address: eventTo,
                            name: "NoName",
                            profilePic: e_profilePic,
                            profileCover: e_profileCover,
                            isApproved: false,
                            call_status: false,
                            call_time: (Date.now() / 1000),
                            nonce: Math.floor(Math.random() * 1000000)
                        });
                        await newUserTo.save();
                        event.userTo = newUserTo;
                    } else {
                        event.userTo = userTo;
                    }
                }
            }
        }
        item.events = events;
        // set collection
        item.collection = await CollectionModel.findOne({ address: _collection }, { _id: 0, __v: 0 }).lean();
        // set item creator
        let creator = await UserModel.findOne({ address: item.creator }, { _id: 0, __v: 0 }).lean();
        if (item.creator !== "0x" && item.creator !== "0x0000000000000000000000000000000000000000" && !creator) {
            const newUser = new UserModel({
                address: item.creator.toLowerCase(),
                name: "NoName",
                profilePic: e_profilePic,
                profileCover: e_profileCover,
                isApproved: false,
                call_status: false,
                call_time: (Date.now() / 1000),
                nonce: Math.floor(Math.random() * 1000000)
            });
            await newUser.save();
            item.creatorUser = newUser;
        } else {
            item.creatorUser = creator;
        }
        // set item owner
        let ownerAddress = item.owner;
        if (pair) ownerAddress = pair.owner;
        else if (auction) ownerAddress = auction.owner;
        let owner = await UserModel.findOne({ address: ownerAddress.toLowerCase() }, { _id: 0, __v: 0 }).lean();
        if (ownerAddress.toLowerCase() !== "0x" && ownerAddress.toLowerCase() !== "0x0000000000000000000000000000000000000000" && !owner) {
            const newUser = new UserModel({
                address: item.owner.toLowerCase(),
                name: "NoName",
                profilePic: e_profilePic,
                profileCover: e_profileCover,
                isApproved: false,
                call_status: false,
                call_time: (Date.now() / 1000),
                nonce: Math.floor(Math.random() * 1000000)
            });
            await newUser.save();
            item.ownerUser = newUser;
        } else {
            item.ownerUser = owner;
        }
        return res.status(200).send({ item: item });
    },
    like: async function (req, res, next) {
        if (!req.body.address || !req.body.tokenId || !req.body.collection)
            return res.status(400).send("missing params");
        let address = req.body.address.toLowerCase();
        let item = await ItemModel.findOne({ tokenId: req.body.tokenId, itemCollection: req.body.collection });
        if (!item) return res.status(404).send({ message: "No item found" });
        const likeCount = item.likeCount;
        let likeStatus = false;
        if (item.likes.includes(address)) {
            item.likes.splice(item.likes.indexOf(address), 1);
            item.likeCount = likeCount - 1;
        } else {
            item.likes.push(address);
            item.likeCount = likeCount + 1;
            likeStatus = true;
            let newEvent = new EventModel({
                id: `like-${address}-${parseInt(Date.now() / 1000)}`,
                timestamp: parseInt(Date.now() / 1000),
                txHash: '',
                itemCollection: req.body.collection,
                tokenId: req.body.tokenId,
                name: 'Liked',
                from: address,
                to: '',
                price: 0,
                metadata: 'Liked',
            });
            await newEvent.save();
        }
        await item.save();
        return res.status(200).send({ item: item, likeStatus: likeStatus });
    },
    getLikeItems: async function (req, res, next) {
        let userAddress = req.query.user ? req.query.user.toLowerCase() : 'None';
        let page = parseInt(req.query.page) || 1;
        let pageLimit = e_pageLimit;
        if (userAddress === 'None') return res.send({ message: "user is none", items: [] });
        let items = await ItemModel.find({ likes: userAddress }, { _id: 0, __v: 0 }).limit(pageLimit).skip((page - 1) * pageLimit).lean();
        let likeItems = [];
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.itemOwner === e_marketAddr) {
                let pair = await PairModel.findOne({ tokenId: item.tokenId, itemCollection: item.itemCollection, bValid: true }, { _id: 0, __v: 0 }).lean();
                if (pair) item.pair = pair;
            } else if (item.itemOwner === e_auctionAddr) {
                let auction = await AuctionModel.findOne({ tokenId: item.tokenId, itemCollection: item.itemCollection, active: true }, { _id: 0, __v: 0 }).lean();
                if (auction) {
                    auction.price = auction.startPrice;
                    let bids = await BidModel.find({ auctionId: auction.id }, { _id: 0, __v: 0 }).sort({ bidPrice: -1 }).lean();
                    auction.bids = bids;
                    if (bids.length > 0) auction.price = bids[0].bidPrice;
                    item.auction = auction;
                }
            }
            let creator = await UserModel.findOne({ address: item.creator }, { _id: 0, __v: 0 }).lean();
            if (item.creator !== "0x" && item.creator !== "0x0000000000000000000000000000000000000000" && !creator) {
                const newUser = new UserModel({
                    address: item.creator.toLowerCase(),
                    name: "NoName",
                    profilePic: e_profilePic,
                    profileCover: e_profileCover,
                    isApproved: false,
                    call_status: false,
                    call_time: (Date.now() / 1000),
                    nonce: Math.floor(Math.random() * 1000000)
                });
                await newUser.save();
                item.creatorUser = newUser;
            } else {
                item.creatorUser = creator;
            }
            let ownerUserItem = await UserModel.findOne({ address: item.owner }, { _id: 0, __v: 0 }).lean();
            if (item.owner !== "0x" && item.owner !== "0x0000000000000000000000000000000000000000" && !ownerUserItem) {
                const newUser = new UserModel({
                    address: item.owner,
                    name: "NoName",
                    profilePic: e_profilePic,
                    profileCover: e_profileCover,
                    isApproved: false,
                    call_status: false,
                    call_time: (Date.now() / 1000),
                    nonce: Math.floor(Math.random() * 1000000)
                });
                await newUser.save();
                item.ownerUser = newUser;
            } else {
                item.ownerUser = ownerUserItem;
            }
            likeItems.push(item);
        }
        return res.status(200).send({ items: likeItems });
    },
    categories: async function (req, res, next) {
        let categories = await CategoryModel.find({}, { _id: 0, __v: 0 });
        if (!categories) return res.status(404).send({ message: "No item found" });
        return res.status(200).send({ categories: categories });
    },
    handleGetRequest: function (req, limit) {
        const pageLimit = parseInt(req.query.pageLimit) || limit;
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
        else if (sortBy === "likeCount") sort = { likeCount: sortDir };
        else if (sortBy === "price") sort = { price: sortDir };
        else sort = { timestamp: sortDir };

        if (req.query.likes) req.query.likes = req.query.likes.toLowerCase();
        if (req.query.creator) req.query.creator = req.query.creator.toLowerCase();
        if (req.query.owner) req.query.owner = req.query.owner.toLowerCase();
        if (req.query.onsale) req.query['$or'] = [{ itemOwner: e_marketAddr }, { itemOwner: e_auctionAddr }];
        delete req.query.onsale;

        if (req.query.owned) req.query.itemOwner = req.query.owner.toLowerCase();
        delete req.query.owned;

        const saleType = req.query.saleType;
        delete req.query.saleType;

        if (saleType === 'fixed') req.query.itemOwner = e_marketAddr;
        else if (saleType === 'auction') req.query.itemOwner = e_auctionAddr;
        else if (saleType === 'all') req.query['$or'] = [{ itemOwner: e_marketAddr }, { itemOwner: e_auctionAddr }];

        const searchTxt = req.query.searchTxt;
        delete req.query.searchTxt;
        if (searchTxt) {
            const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
            const searchRgx = rgx(searchTxt);
            req.query.name = { $regex: searchRgx, $options: "i" };
        }
        req.query.itemStatus = true;
        return { query: req.query, sort: sort, skip: skip, limit: pageLimit };
    },
});

