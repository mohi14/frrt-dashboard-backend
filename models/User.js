const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    roleNumber: { type: Number, default: 0 },
    roleName: { type: String, default: 'user' },
    permissionCharacter: { type: String, default: 'user' },
    roleOrder: { type: Number, default: 0 },
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now },
    operation: { type: String, default: 'active' },
  });
  

const UserSchema = new mongoose.Schema({
    address: {type: String, lowercase: true},  // user address
    nonce: {type: Number, defuault: Math.floor(Math.random() * 1000000)},
    name: String,  // name of user
    bio: String,  // bio or descripton of user
    facebookLink: String,  // your website link
    twitterLink: String,  // twitter username
    googleLink: String,  // email address
    profilePic: String,  // profile image
    profileCover: String,  // profile cover image
    isApproved: {type: Boolean, default: false},  // user status 
    call_status: Boolean,
    call_time: Number,
    last_login: {type: Date},  // time is latest logged in


    /* BELOW ADDED BY GREG FOR SYSTEM CONFIGURATION, you can change anything above this but not below */
    userId: {type: String, unique: true, index: true},
    suerNumber: {type: Number, unique: true, index: true},
    userNickName: {type: String, unique: true, index: true},
    phoneNumber: {type: String, unique: true, index: true},
    status: {type: String, default: 'active'},
    createdAt: {type: Date, default: Date.now},
    operation: {type: String, default: 'active'},
    role: RoleSchema,
});

UserSchema.index({address: 1}, {unique: true});
UserSchema.index({call_status: 1});

module.exports.User = mongoose.model('users', UserSchema);
