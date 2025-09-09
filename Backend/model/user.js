const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

module.exports = mongoose.model('User', userSchema);

//automatically a collection named users is created under the database DevTinder , collection name is (lowercase + plural) model name , this conversion is carried out by mongoose
