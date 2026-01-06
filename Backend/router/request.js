const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middleware/auth.js');
const {
  sendConnectionRequest,
  sendRequest,
  reviewRequest,
  deleteConnection,
} = require('../controllers/requestController');
const {
  deleteUser,
  updateUser,
  getUserByEmail,
} = require('../controllers/userController');

//Send connection request
requestRouter.post('/sendconnectionreq', userAuth, sendConnectionRequest);

// The following routes were incorrectly placed here and are now handled by the user router or are deprecated.
// For clarity during refactoring, they are removed.
// A clean router should only handle request-related endpoints.

// Sender requests
requestRouter.post('/request/send/:status/:userId', userAuth, sendRequest);

//Receiver requests
requestRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  reviewRequest
);

//delete exiting connections (unfriend)
requestRouter.delete(
  '/request/review/deleteConnection/:requestId',
  userAuth,
  deleteConnection
);

module.exports = requestRouter;
