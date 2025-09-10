const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 20,
    },
    lastName: {
      type: String,
      maxLength: 20,
    },
    emailId: {
      type: String,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 18,
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
    },
    skills: {
      type: [String],
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

module.exports = mongoose.model('User', userSchema);

//automatically a collection named users is created under the database DevTinder , collection name is (lowercase + plural) model name , this conversion is carried out by mongoose
