const{Schema, model} = require('mongoose')

const postSchema = new Schema({
      file_url:{
            type:String,
            require: true
      },
      caption:{
            type:String,
            require: true,
            default : ""
      },
      user_id:{
            type: Schema.ObjectId,
            ref: 'user'
      },
      likes:[
            {
             type: Schema.ObjectId,
            ref: 'user',
            default: [],
            }
      ],
      comments:[
            {
                  type: Schema.ObjectId,
            ref: 'comments',
            default: [],
            }
      ]

},{timestamps: true})
const Post = model('Post', postSchema)
module.exports = Post