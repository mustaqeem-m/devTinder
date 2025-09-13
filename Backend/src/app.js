const express = require('express');
const app = express();
const { userAuth } = require('../middleware/auth.js');
const { connectDB } = require('../config/database.js');
const User = require('../model/user.js');
const { signUpValidator } = require('../utils/validation.js');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cookieParser());

const authRouter = require('../router/auth');
const profileRouter = require('../router/profile.js');
const requestRouter = require('../router/request.js');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

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
