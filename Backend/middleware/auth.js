const jwt = require('jsonwebtoken');
const User = require('../model/user');
const cookieParser = require('cookie-parser');

const userAuth = async (req, res, next) => {
  try {
    //read the token from the req cookies
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      res
        .status(401)
        .send('Login session expired, please login again to contiue!');
    }
    //validate the token
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedObj;
    //find the corresponding user of the token
    const user = await User.findById(_id);
    req.user = user;
    if (!user) {
      throw new Error('User not found');
    }
    next();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = {
  userAuth,
};
