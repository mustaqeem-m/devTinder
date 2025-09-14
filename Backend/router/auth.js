const express = require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const user = require('../model/user');
const User = require('../model/user.js');
const { signUpValidator } = require('../utils/validation.js');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { userAuth } = require('../middleware/auth.js');

//user Login
authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('User not found!');
    } else {
      //1. verifying the match
      const isPasswordValid = await user.validatePass(password);
      if (isPasswordValid) {
        //! 1.creating token
        const token = await user.getJwt(); // creating the token using jwt.sign
        //! 2.wrapping it up inside cookie
        res.cookie('token', token, {
          expires: new Date(Date.now() + 8 * 3600000),
        }); //wrapping token with a cookie using res.cookie
        res.json({ message: 'User successfully logged in!😄', data: user });
      } else {
        throw new Error('password is not matched');
      }
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//user Logout
authRouter.post('/logout', userAuth, async (req, res) => {
  try {
    res.clearCookie('token');
    return res.send('User logged out successfully! ');
  } catch (err) {
    res.status(400).send({ Error: err.message });
  }
});

//Signup API
authRouter.post('/signup', async (req, res) => {
  try {
    //1. validation of data from req.body
    signUpValidator(req);
    const { firstName, lastName, emailId, password } = req.body;

    //2. Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    //3.Create the new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send('User Added to DB sucessfully');
  } catch (err) {
    res.send(`Error message => ${err}`);
  }
});

module.exports = authRouter;
