const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middleware/auth.js');
const User = require('../model/user.js');
const { validateEditProfileData } = require('../utils/validation.js');
const validator = require('validator');
const bcrypt = require('bcrypt');

//Profile
profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error('user not found!');
    }
    res.send(user);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// profile/edit
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    const user = req.user;
    const data = req.body;
    //update user specific detail
    validateEditProfileData(data);

    if (!validateEditProfileData) {
      res.status(400).send('Invalid Edit Request');
    }

    req.body.forEach((feild) => {
      user[feild] = req.body.feild;
    });

    const ans = await User.findByIdAndUpdate({ _id: user._id }, data, {
      returnDocument: 'before',
      runValidators: true,
      returnDocument: 'after',
    });
    console.log(ans);
    res.send(
      `User details of ${
        data.firstName || user.firstName
      } bhai updated successfully! ☠️`
    );
  } catch (err) {
    res.status(400).send({ Error: err.message });
  }
});

//profile/password
profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  const user = req.user;
  try {
    const existingPass = req.body?.password;
    const newPassword = req.body?.newPassword;
    //validating the existing password that matches the user's password
    const validationStatus = await user.validatePass(existingPass);
    if (!validationStatus) {
      return res
        .status(400)
        .send('Existing password not matches the old password');
    } else {
      // cheking the new password is strong enough
      const isStrong = validator.isStrongPassword(newPassword);
      if (!isStrong) {
        return res.status(400).send('Please Enter a strong new password');
      } else {
        //2. Encrypt the password
        const passwordHash = await bcrypt.hash(newPassword, 10);
        user.password = passwordHash;
      }
    }
    await user.save();
    return res.send(` ${user} `);
  } catch (err) {
    res.status(400).send({ Error: err.message });
  }
});

module.exports = profileRouter;
