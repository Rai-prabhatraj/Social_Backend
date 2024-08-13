// const { Schema, model } = require('mongoose')
const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, min: 6, max: 30 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    profile_pic: { type: String, default: '' },
    followers: [{ type: mongoose.Schema.ObjectId, ref: "user", default: [] }],
    followings: [{ type: mongoose.Schema.ObjectId, ref: "user", default: [] }]
})


const User = mongoose.model('user', UserSchema)
module.exports = User;