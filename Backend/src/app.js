const express = require('express');
const app = express();
const { adminAuth, userAuth } = require('../middleware/auth.js');
const { connectDB } = require('../config/database.js');
const User = require('../model/user.js');
const { signUpValidator } = require('../utils/validation.js');
const bcrypt = require('bcrypt');

app.use(express.json());

//delete user by id
app.use('/deleteuser', async (req, res) => {
  try {
    await User.findByIdAndDelete({ _id: req.body.userId });
    res.send('user deleted successfully');
  } catch (err) {
    res.send(`${err}`);
  }
});

//update user specific detail
app.patch('/updateuser/:userId', async (req, res) => {
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
    console.log(ans);
    res.send(`User details of ${userId} uodated successfully! ☠️`);
  } catch (err) {
    res.send('Update of this feild not allowed', err);
  }
});

//Get user by email
app.use('/userbyemail', async (req, res) => {
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
app.use('/feed', async (req, res) => {
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

app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('User not found!');
    } else {
      //1. verifying the match
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        res.send('User successfully logged in!😄');
      } else {
        throw new Error('password is not macthed');
      }
    }
  } catch (err) {
    res.status(400).send('Invalid emailId and password!', err);
  }
});

//Signup API
app.post('/signup', async (req, res) => {
  try {
    //1. validation of data from req.body
    signUpValidator(req);
    const { firstName, lastName, emailId, password } = req.body;

    //2. Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

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

connectDB()
  .then(() => {
    console.log('Database Connection Successfully established!');
    app.listen(2222, () => {
      console.log('server is listening to the port 2222');
    });
  })
  .catch((err) => {
    console.log(err);
  });
