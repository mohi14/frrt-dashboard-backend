const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    id: {type: Number, index: true},  // 1: common, 2: e_graphql, 3: fraction
    timestamp: {type: Number, required: true, default: 1},
});

module.exports.Setting = mongoose.model('settings', SettingSchema);
