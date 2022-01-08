const mongoose = require("mongoose");

connectDB = () => {
  mongoose
    .connect("mongodb://localhost:27017/flywheel")
    .then((result) => {
      console.log("MongoDB Connected...");
    })
    .catch((err) => {
      console.log("MongoDB Connection Error!!!");
      process.exit(0);
    });
};

module.exports = connectDB;
