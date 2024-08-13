const express = require('express')
const userRoute = express.Router();
const userController = require('../controllers/userController')
const middleware = require('../middlewares/authMiddleware')


userRoute.post('/signup', userController.userSignUp)
userRoute.post('/login', userController.userLogIn)
userRoute.get('/profile/:id', middleware.verifyToken, userController.userProfile)
userRoute.post('/follow', middleware.verifyToken, userController.followUser)
userRoute.get('/followers/list', middleware.verifyToken, userController.getFollowersList)
userRoute.get('/followings/list', middleware.verifyToken, userController.getFollowingsList)
userRoute.post('/unfollow', middleware.verifyToken, userController.unfollowUser)
userRoute.put('/:id', middleware.verifyToken, userController.updateUserProfile)



module.exports = userRoute;