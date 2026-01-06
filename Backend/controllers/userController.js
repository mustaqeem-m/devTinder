const User = require('../model/user.js');
const ConnectionRequest = require('../model/request.js');

const USER_SAFE_DATA = 'firstName lastName age profile gender skills about';

// Functions from user.js router
const getReceivedRequests = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingReq = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', USER_SAFE_DATA);
    const data = pendingReq.map((pendingReq) => pendingReq);
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
};

const getConnections = async (req, res) => {
  try {
    const loggedInUser = req.user;
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
};

const getUserFeed = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const alreadyConnected = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const hideUsersFromFeed = new Set();
    alreadyConnected.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

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
};

// Functions from request.js router
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete({ _id: req.body.userId });
    res.send('user deleted successfully');
  } catch (err) {
    res.send(`${err}`);
  }
};

const updateUser = async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ['profile', 'about', 'gender', 'age', 'skills'];

    const isAllowedUpdates = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isAllowedUpdates) {
      res.status(400).send('User not Allowed to update this feild');
    }
    if (data.skills.length > 10) {
      res.status(400).send('Skill not be more than 10');
    }
    const ans = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: 'before',
      runValidators: true,
      returnDocument: 'after',
    });
    res.send(`User details of ${userId} uodated successfully! ☠️`);
  } catch (err) {
    res.send('Update of this feild not allowed', err);
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) {
      res.send('User dead!');
    } else {
      res.send(user);
    }
  } catch (err) {
    res.send(`${err}`);
  }
};

module.exports = {
  getReceivedRequests,
  getConnections,
  getUserFeed,
  deleteUser,
  updateUser,
  getUserByEmail,
};
