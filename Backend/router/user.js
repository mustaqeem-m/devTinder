const express = require('express');
const { userAuth } = require('../middleware/auth');
const userRouter = express.Router();
const {
  getReceivedRequests,
  getConnections,
  getUserFeed,
} = require('../controllers/userController');

// get all pending request for loggedin user
userRouter.get('/user/requests/recieved', userAuth, getReceivedRequests);

// get all the connection, who accepted loggedIn user req
userRouter.get('/user/connections', userAuth, getConnections);

//Main API - user/feed
userRouter.get('/user/feed', userAuth, getUserFeed);

module.exports = userRouter;
