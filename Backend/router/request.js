const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middleware/auth.js');
const ConnectionRequest = require('../model/request');
const { default: isFQDN } = require('validator/lib/isFQDN.js');
const user = require('../model/user.js');

//Send connection request
requestRouter.post('/sendconnectionreq', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(
      `Connection request by user : ${user.firstName} send successfully!`
    );
  } catch (err) {
    res.status(400).send({ Error: err.message });
  }
});

//delete user by id
requestRouter.use('/deleteuser', async (req, res) => {
  try {
    await User.findByIdAndDelete({ _id: req.body.userId });
    res.send('user deleted successfully');
  } catch (err) {
    res.send(`${err}`);
  }
});

//update user specific detail
requestRouter.patch('/updateuser/:userId', userAuth, async (req, res) => {
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
});

//Get user by email
requestRouter.use('/userbyemail', async (req, res) => {
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
});

//Feed by email - get all users
requestRouter.use('/feed', async (req, res) => {
  try {
    const user = await User.find({});
    if (!user) {
      res.send('Error in feed');
    } else {
      res.send(user);
    }
  } catch (err) {
    res.send(`Error message => ${err}`);
  }
});

// TODO creating a API for POST /request/send/:status/:userId
requestRouter.patch(
  '/request/send/:status/:userId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      //validation check
      // if (String(fromUserId) === String(toUserId)) {
      //   return res
      //     .status(400)
      //     .send('Your Id and receiver User Id are not meant to be same');
      // }
      const IdCheck = await user.findById(toUserId);
      if (!IdCheck) {
        return res
          .status(400)
          .send('Invalid UserID , User not found with this Id');
      }

      const AllowedStatus = ['ignored', 'interested'];
      if (!AllowedStatus.includes(status)) {
        return res.status(400).send('Invalid Status');
      }
      //Duplicate Request check
      const duplicateReq = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (duplicateReq) {
        return res.status(400).send('connection request already exists!');
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();
      res.status(200).json({
        message: `${req.user.firstName} ${
          status == 'ignored' ? 'ignored' : 'is interested in'
        } ${IdCheck.firstName}`,
        data: connectionRequest,
      });
    } catch (err) {
      res.status(400).send({ Error: err.message });
    }
  }
);

module.exports = requestRouter;
