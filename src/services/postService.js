const cloudinary = require('../helpers/cloudinary');
const Post = require('../models/postModel');
const app_constants = require('../constants/app.json')
const fs = require('fs');
const { Types } = require('mongoose')


exports.uploadPost = async (data, user_data) => {
    const { _id } = user_data;
    const { file } = data
    const caption = data.caption ? data.caption : ''

    const file_url = await cloudinary.uploader.upload(file.path)

    const upload_post = await Post.create({
        file_url: file_url.url, caption, user_id: _id
    })

    if (upload_post) {
        fs.unlink(file.path, (err) => {
            if (err) console.log(err);
        })
        return { success: 1, status: app_constants.SUCCESS, message: 'Post uploaded successfully!', result: upload_post };
    }

    return { success: 0, status: app_constants.INTERNAL_SERVER_ERROR, message: 'Internal server error!', result: {} }
}


exports.getPostList = async (data) => {
    const { id } = data;
    const limit = data.limit ? data.limit : 10000;
    const offset = data.offset ? data.offset : 0;
    const search = data.search ? data.search : ''
    let search_query = {};
    const mongo_id = new Types.ObjectId(id)

    if (search) {
        const regex = new RegExp(search, 'i')
        search_query['$or'] = [
            { "caption": regex }
        ]
    }

    const pipeline = [
        { $match: { user_id: mongo_id } },
        { $match: search_query }
    ]

    const [result, total_count] = await Promise.all([
        Post.aggregate([
            ...pipeline,
            { $sort: { createdAt: -1 } },
            {
                $project: { __v: 0, user_id: 0 }
            },
            { $skip: +offset },
            { $limit: Number(limit) },
        ]),
        Post.aggregate([
            ...pipeline,
            { $count: "total_count" }
        ])
    ])

    if (result) {
        return { success: 1, status: app_constants.SUCCESS, message: 'Post list fetched successfully!', total_count: total_count.length ? total_count[0].total_count : 0, result };
    }

    return { success: 0, status: app_constants.INTERNAL_SERVER_ERROR, message: 'Internal server error!', result: {} }
}


exports.updatePost = async (data, user_data) => {
    const { file, post_id } = data
    const caption = data.caption ? data.caption : ''

    const post_data = await Post.findOne({ _id: post_id })
    if (!post_data) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'Post does not exists!', result: {} };
    }

    if (post_data.user_id.toString() != user_data._id.toString()) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'You can only update your post!', result: {} };
    }

    const file_url = await cloudinary.uploader.upload(file.path)

    const update_post = await Post.updateOne(
        { _id: post_id },
        { $set: { file_url: file_url.url, caption } }
    )

    if (update_post) {
        // fs.unlink(file.path, (err) => {
        //     if (err) console.log(err);
        // })
        return { success: 1, status: app_constants.SUCCESS, message: 'Post updated successfully!', result: update_post };
    }

    return { success: 0, status: app_constants.INTERNAL_SERVER_ERROR, message: 'Internal server error!', result: {} }
}


exports.likePost = async (data, user_data) => {
    const { post_id } = data
    const { _id } = user_data;

    const post_data = await Post.findOne({ _id: post_id })
    if (!post_data) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'Post does not exists!', result: {} };
    }

    const like_check = post_data.likes.includes(_id)
    if (like_check) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'Post is already liked!', result: {} }
    }

    post_data.likes.push(_id)

    const update_post = await Post.updateOne(
        { _id: post_id },
        { $set: { likes: post_data.likes } }
    )

    if (update_post) {
        return { success: 1, status: app_constants.SUCCESS, message: 'Post liked successfully!', result: update_post };
    }

    return { success: 0, status: app_constants.INTERNAL_SERVER_ERROR, message: 'Internal server error!', result: {} }
}


exports.unlikePost = async (data, auth_user_data) => {
    const auth_user_id = auth_user_data._id
    const existing_followings = auth_user_data.followings
    const unfollow_user_id = data.id;

    if (auth_user_id == unfollow_user_id) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'Can not unfollow yourself!', result: {} }
    }

    const user_data = await User.findOne({ _id: unfollow_user_id })
    if (!user_data) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'User does not exist!', result: {} }
    }

    const unfollow_check = existing_followings.includes(unfollow_user_id)
    if (!unfollow_check) {
        return { success: 0, status: app_constants.BAD_REQUEST, message: 'User is not followed!', result: {} }
    }

    // const filtered_existing_foolowings = existing_followings.filter((elem) => elem != unfollow_user_id)
    const filtered_existing_foolowings = existing_followings.filter((e) => {
        return e != unfollow_user_id
    })
    
    const filtered_followers = user_data.followers.filter((elem) => elem != auth_user_id.toString())

    const [update_unfollow_user, update_auth_user] = await Promise.all([
        User.updateOne(
            { _id: unfollow_user_id },
            { $set: { followers: filtered_followers } }
        ),
        User.updateOne(
            { _id: auth_user_id },
            { $set: { followings: filtered_existing_foolowings } }
        )
    ])

    if (update_unfollow_user && update_auth_user) {
        return { success: 1, status: app_constants.SUCCESS, message: 'User unfollowed successfully!', result: {} };
    }

    return { success: 0, status: app_constants.INTERNAL_SERVER_ERROR, message: 'Internal server error!', result: {} }
}