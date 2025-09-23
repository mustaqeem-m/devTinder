const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
  } catch (err) {
    console.log(`error message => ${err}`);
  }
};

module.exports = {
  connectDB,
};
