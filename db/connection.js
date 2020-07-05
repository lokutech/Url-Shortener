const mongoose = require("mongoose");
const config = require('config')

const url = process.env.MONGO_URI

const connectDB = async () => {
  try {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB Connected...`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = connectDB;