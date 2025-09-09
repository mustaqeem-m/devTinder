const express = require('express');
const app = express();
const { adminAuth, userAuth } = require('../middleware/auth.js');
const { connectDB } = require('../config/database.js');
const User = require('../model/user.js');

app.post('/signup', async (req, res) => {
  try {
    const user = new User({
      firstName: 'Mohammed',
      lastName: 'Muzammil',
      emailId: 'zamil62709@gmail.com',
      password: 'anoioqe',
      age: 20,
      gender: 'male',
    });

    await user.save();
    res.send('User Added to DB sucessfully');
  } catch (err) {
    console.log(`Error message => ${err}`);
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
