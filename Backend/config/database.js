const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://mustaqeem-m:Mustaqeem123@cluster0.tez2rqy.mongodb.net/DevTinder'
    );
  } catch (err) {
    console.log(`error message => ${err}`);
  }
};

module.exports = {
  connectDB,
};
