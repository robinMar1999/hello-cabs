const Ride = require("../models/ride");

const initRideCollection = async () => {
  try {
    await Ride.deleteMany();
    console.log("Ride Collection Initialized...");
  } catch (err) {
    console.log(err);
  }
};

module.exports = initRideCollection;
