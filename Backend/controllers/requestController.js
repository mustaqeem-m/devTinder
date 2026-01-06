const ConnectionRequest = require('../model/request');
const user = require('../model/user');
const sendEmail = require('../utils/sendEmail');

const sendConnectionRequest = async (req, res) => {
  try {
    const user = req.user;
    res.send(
      `Connection request by user : ${user.firstName} send successfully!`
    );
  } catch (err) {
    res.status(400).send({ Error: err.message });
  }
};

const sendRequest = async (req, res) => {
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

    //ses
    const subject = `${req.user.firstName} ${
      status === 'ignored' ? 'ignored' : 'is interested in'
    } ${IdCheck.firstName}`;
    const html = `<p>${req.user.firstName} ${
      status === 'ignored' ? 'ignored' : 'is interested in'
    } ${IdCheck.firstName}</p>
              <p>Visit their profile: https://devstinder.online/user/${
                req.user.id
              }</p>`;
    const text = `${req.user.firstName} ${
      status === 'ignored' ? 'ignored' : 'is interested in'
    } ${IdCheck.firstName}`;

    const recipient = IdCheck.emailId || 'mmmustaqeem1910@gmail.com'; // fallback for testing

    try {
      const emailRes = await sendEmail.run({
        to: recipient,
        subject,
        html,
        text,
        // from: 'no-reply@devstinder.online' // optional: will default to DEFAULT_FROM
      });
      console.log('Email sent, MessageId:', emailRes.messageId);
    } catch (err) {
      console.error('Failed to send email:', err.message || err);
    }
    res.status(200).json({
      message: `${req.user.firstName} ${
        status == 'ignored' ? 'ignored' : 'is interested in'
      } ${IdCheck.firstName}`,
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send({ Error: err.message });
  }
};

const reviewRequest = async (req, res) => {
  try {
    //toUserId === loggedInUser
    const loggedInUser = req.user;
    //validate status
    const AllowedStatus = ['accepted', 'rejected'];
    const { status, requestId } = req.params;
    if (!AllowedStatus.includes(status)) {
      return res.status(400).send('Invalid status type');
    }
    //status must be interested if its ignored not be here
    //validate requestId (fromUserId)
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: 'interested',
    });
    if (!connectionRequest) {
      return res.status(400).send('Connection request not found!');
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.send({
      message: `Connection Request ${status} successfully`,
      data: data,
    });
  } catch (err) {
    res.status(400).send({ Error: err.message });
  }
};

const deleteConnection = async (req, res) => {
  //1. validate user
  //2. find corresponding request from DB
  //3. delete that req that make the connection delete
  try {
    const loggedInUser = req.user;
    const requestId = req.params.requestId;
    const deleteReq = await ConnectionRequest.findOneAndDelete({
      _id: requestId,
      status: 'accepted',
    });

    if (!deleteReq) {
      res.statu(400).send('Connection Not found to delete!');
    }

    res.json(
      { message: 'Connection Deleted Successfully' },
      { data: deleteReq }
    );
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
};

module.exports = {
  sendConnectionRequest,
  sendRequest,
  reviewRequest,
  deleteConnection,
};
