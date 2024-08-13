const userServices = require('../services/userService')
const validationHelper = require('../helpers/validation')
const app_constants = require('../constants/app.json')
const cloudinary = require('cloudinary').V2;


exports.userSignUp = async (req, res) => {
    // validation checks
    try {
        const required_fields = ['username', 'email', 'password']

        const validation = validationHelper.validation(required_fields, req.body)

        if (Object.keys(validation).length) {
            return res.json({ success: 0, status: app_constants.BAD_REQUEST, message: validation, result: {} })
        }

        const valid_email = validationHelper.validEmail(req.body.email)
        if (!valid_email) {
            return res.json({ success: 0, status: app_constants.BAD_REQUEST, message: 'Invalid email!', result: {} })
        }

        const add_user = await userServices.userSignUp(req.body)
        return res.json(add_user)
    }
    catch (ex) {
        console.log(ex);
    }
}


exports.userLogIn = async (req, res) => {
    // validation checks
    try {
        const required_fields = ['email', 'password']

        const validation = validationHelper.validation(required_fields, req.body)

        if (Object.keys(validation).length) {
            return res.json({ success: 0, status: app_constants.BAD_REQUEST, message: validation, result: {} })
        }

        const valid_email = validationHelper.validEmail(req.body.email)
        if (!valid_email) {
            return res.json({ success: 0, status: app_constants.BAD_REQUEST, message: 'Invalid email!', result: {} })
        }

        const login_user = await userServices.userLogIn(req.body)
        return res.json(login_user)
    }
    catch (ex) {
        console.log(ex);
    }
}


exports.userProfile = async (req, res) => {
    try {
        const required_fields = ['id']

        const validation = validationHelper.validation(required_fields, req.params)

        if (Object.keys(validation).length) {
            return res.json({ success: 0, status: app_constants.BAD_REQUEST, message: validation, result: {} })
        }

        const get_user = await userServices.userProfile(req.params)
        return res.json(get_user)
    }
    catch (ex) {
        console.log(ex);
    }
}


exports.followUser = async (req, res) => {
    try {
        const required_fields = ['id']

        const validation = validationHelper.validation(required_fields, req.body)

        if (Object.keys(validation).length) {
            return res.json({ success: 0, status: app_constants.BAD_REQUEST, message: validation, result: {} })
        }

        const follow_user = await userServices.followUser(req.body, req.user)
        return res.json(follow_user)
    }
    catch (ex) {
        console.log(ex);
    }
}


exports.getFollowersList = async (req, res) => {
    try {
        const get_users = await userServices.getFollowersList(req.user, req.query)
        return res.json(get_users)
    }
    catch (ex) {
        console.log(ex);
    }
}


exports.getFollowingsList = async (req, res) => {
    try {
        const get_users = await userServices.getFollowingsList(req.user, req.query)
        return res.json(get_users)
    }
    catch (ex) {
        console.log(ex);
    }
}


exports.unfollowUser = async (req, res) => {
    try {
        const required_fields = ['id']

        const validation = validationHelper.validation(required_fields, req.body)

        if (Object.keys(validation).length) {
            return res.json({ success: 0, status: app_constants.BAD_REQUEST, message: validation, result: {} })
        }

        const unfollow_user = await userServices.unfollowUser(req.body, req.user)
        return res.json(unfollow_user)
    }
    catch (ex) {
        console.log(ex);
    }
}

exports.updateUserProfile = async (req, res) => {
    try {
        const required_fields = ['id']

        const validation = validationHelper.validation(required_fields, req.params)

        if (Object.keys(validation).length) {
            return res.json({ success: 0, status: app_constants.BAD_REQUEST, message: validation, result: {} })
        }
        let updatedData = { ...req.body };

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'user_profiles',
                    resource_type: 'image'
                });

                updatedData.profile_picture = result.secure_url;
            } catch (error) {
                return res.json({ success: 0, status: app_constants.INTERNAL_SERVER_ERROR, message: 'Error uploading image to Cloudinary', result: {} });
            }
        }

        const update_user = await userServices.updateUserProfile(req.params.id, updatedData);
        return res.json(update_user);
    } catch (ex) {
        console.log(ex);
        return res.json({ success: 0, status: app_constants.INTERNAL_SERVER_ERROR, message: 'Internal server error', result: {} });
    }
};