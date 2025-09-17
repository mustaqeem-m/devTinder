const express = require('express');
const { userAuth } = require('../middleware/auth');
const userRouter = express.Router();
const ConnectionRequest = require('../model/request');
const User = require('../model/user');

// get all pending request for loggedin user
const USER_SAFE_DATA = 'firstName lastName age profile gender skills about';

userRouter.get('/user/requests/recieved', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingReq = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', USER_SAFE_DATA);
    const data = pendingReq.map(({ fromUserId }) => fromUserId);
    res.json({
      message: `${
        pendingReq.length === 0
          ? 'You dont have any pending requests left'
          : 'Pending request list'
      }`,
      data: data,
    });
  } catch (err) {
    res.status(400).send({ Error: err.message });
  }
});

// get all the connection, who accepted loggedIn user req
userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // if (fromUserId === loggedInUser._id) {
    //   let showId = 'toUserId';
    // } else {
    //   let showId = 'fromUserId';
    // }
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: 'accepted',
    })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (String(row.fromUserId._id) === String(loggedInUser._id)) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({
      message: `${
        connections.length === 0
          ? 'You deos not have any active connections yet 😗'
          : 'Connections List'
      }`,
      data: data,
    });
  } catch (err) {
    res.status(400).send({ Error: err.message });
  }
});

//Main API - user/feed

userRouter.get('/user/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    //feed API excludes the following
    // 1. all the connection request which the loggedIn user sent or received
    const alreadyConnected = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const hideUsersFromFeed = new Set();

    alreadyConnected.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    //fetching all user from document expect above
    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json(feedUsers);
  } catch (err) {
    res.status(400).send({ Error: err.message });
  }
});

module.exports = userRouter;
