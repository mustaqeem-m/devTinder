const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
      minLength: 5,
      maxLength: 20,
    },
    lastName: {
      type: String,
      maxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid Email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error('Please enter a strong password');
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!['male', 'female', 'Others'].includes(value)) {
          throw new Error('Gender not valid');
        }
      },
    },
    profile: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error('photo url invalid');
        }
      },
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error('Skills not supposed to be more than 10');
        }
      },
    },
    about: {
      type: String,
      default: 'Hey there!',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, 'DevTinder@123', {
    expiresIn: '1d',
  });
  return token;
};

userSchema.methods.validatePass = async function (passwordInputByUser) {
  const user = this;
  const actualPassword = user.password;
  const isValid = await bcrypt.compare(passwordInputByUser, actualPassword);

  return isValid;
};

userSchema.index({ firstName: 1, lastName: 1 });

module.exports = mongoose.model('User', userSchema);

//automatically a collection named users is created under the database DevTinder , collection name is (lowercase + plural) model name , this conversion is carried out by mongoose
