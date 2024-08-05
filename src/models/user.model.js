const mongoose = require(`mongoose`)

const Userschema = new mongoose.Schema({
    Username:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required : true
        },
        password:{
            type: String,
            required: true
        },
})

const User = mongoose.model('User',Userschema)
module.exports = User;