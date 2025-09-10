const express = require('express');
const app = express();
const { adminAuth, userAuth } = require('../middleware/auth.js');
const { connectDB } = require('../config/database.js');
const User = require('../model/user.js');

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
app.patch('/updateuser', async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  const ans = await User.findByIdAndUpdate({ _id: userId }, data, {
    returnDocument: 'before',
    runValidators: true,
    returnDocument: 'after',
  });
  console.log(ans);
  res.send(`User details of ${data.userId} uodated successfully! ☠️`);
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

//Signup API
app.post('/signup', async (req, res) => {
  try {
    const user = new User(req.body);
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
