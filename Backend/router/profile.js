const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middleware/auth.js');
const {
  viewProfile,
  getProfileByUserId,
  editProfile,
  updatePassword,
} = require('../controllers/profileController.js');

//Profile
profileRouter.get('/profile/view', userAuth, viewProfile);

profileRouter.get('/profile/:userId', getProfileByUserId);

// profile/edit
profileRouter.patch('/profile/edit', userAuth, editProfile);

//profile/password
profileRouter.patch('/profile/password', userAuth, updatePassword);

module.exports = profileRouter;
