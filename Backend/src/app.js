const express = require('express');
const app = express();
const { userAuth } = require('../middleware/auth.js');
const { connectDB } = require('../config/database.js');
const User = require('../model/user.js');
const { signUpValidator } = require('../utils/validation.js');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const http = require('http');
require('dotenv').config({ path: __dirname + '/../../.env' });
require('../utils/cronJobs.js');
const InitializeSocket = require('../utils/socket.js');

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require('../router/auth');
const profileRouter = require('../router/profile.js');
const requestRouter = require('../router/request.js');
const userRouter = require('../router/user.js');
const { chatRouter } = require('../router/chat.js');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', chatRouter);

const server = http.createServer(app);
InitializeSocket(server);

connectDB()
  .then(() => {
    console.log('Database Connection Successfully established!');
    server.listen(process.env.PORT, () => {
      console.log('server is listening to the port 2222');
    });
  })
  .catch((err) => {
    console.log(err);
  });
