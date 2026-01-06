const User = require('../model/user.js');
const { signUpValidator } = require('../utils/validation.js');
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
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
        res.json(user);
      } else {
        throw new Error('Invalid credentials');
      }
    }
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.send('User logged out successfully! ');
  } catch (err) {
    res.status(400).send({ Error: err.message });
  }
};

const signupUser = async (req, res) => {
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
    const savedUser = await user.save();
    //! 1.creating token
    const token = await user.getJwt(); // creating the token using jwt.sign
    //! 2.wrapping it up inside cookie
    res.cookie('token', token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.json({ message: 'User signedUp successfully', data: savedUser });
  } catch (err) {
    res.status(400).send(`Error message => ${err}`);
  }
};

module.exports = {
  loginUser,
  logoutUser,
  signupUser,
};
