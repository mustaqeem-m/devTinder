const express = require('express');
const chatRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const { getChatHistory } = require('../controllers/chatController');

chatRouter.get('/chat/:targetUserId', userAuth, getChatHistory);

module.exports = chatRouter;
