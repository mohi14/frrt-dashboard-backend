const _ = require("underscore");
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User').User;

module.exports = {
    name: "BaseController",
    extend: function (child) {
        return _.extend({}, this, child);
    },
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    authenticateToken: function (req, res, next) {
        // console.log(req.headers);
        // Gather the jwt access token from the request header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401); // if there isn't any token
        jwt.verify(token, process.env.JWT_TOKEN, (err, payload) => {
            if (err) return res.sendStatus(403);
            let address = payload.data;
            UserModel.findOne({address: address})
                .then(user => {
                    if (!user) return res.sendStatus(404);
                    req.user = user;
                    next();
                });

        })
    },
    sortByTimeStamp: function (nodes) {
        return (nodes || []).sort((a, b) => a.timestamp - b.timestamp);
    },
    sleep: async function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    replaceURI: function(uri) {
        if (uri.startsWith("ipfs://ipfs/")) uri = uri.replace("ipfs://ipfs/", "https://ipfs.io/ipfs/");
        if (uri.startsWith("ipfs://")) uri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
        return uri;
    }
};