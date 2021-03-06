const mongoose = require('mongoose');
const config = require('./default.json');
const db = config.mongoDBLocalURL;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    //Exit process when connect failure
    process.exit(1);
  }
};

module.exports = connectDB;
