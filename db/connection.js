const mongoose = require("mongoose");

// const url = "mongodb://127.0.0.1:27017/url_shortener";
const url = "mongodb+srv://loku:goztepe@cluster0-jewru.mongodb.net/url_shortener?retryWrites=true&w=majority";

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