const mongoose = require('mongoose')
require('dotenv').config();

const MONGODB_URI = process.env.MONGO_URI

const connectDatabase = () => {
    mongoose.connect(MONGODB_URI).then(()=>{
        console.log("MONGODB DATABASE Connected successfully!!")
    }).catch((err)=>{
        console.error(err)
    })
}

module.exports = connectDatabase
