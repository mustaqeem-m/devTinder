const express = require('express');
const authRouter = express.Router();
const { userAuth } = require('../middleware/auth.js');
const {
  loginUser,
  logoutUser,
  signupUser,
} = require('../controllers/authController.js');

//user Login
authRouter.post('/login', loginUser);

//user Logout
authRouter.post('/logout', userAuth, logoutUser);

//Signup API
authRouter.post('/signup', signupUser);

module.exports = authRouter;
