const Ride = require("../models/ride");
const checkRideId = async (req, res, next) => {
  if (!req.body.rideId || req.body.rideId === "") {
    return res.status(400).json({ error: "rideId is required" });
  }
  const ride = await Ride.findById(req.body.rideId);
  if (!ride) {
    return res.status(404).json({ error: "Ride Not Found" });
  }
  req.ride = ride;
  next();
};

module.exports = checkRideId;
