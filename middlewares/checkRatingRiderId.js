const Rider = require("../models/rider");
const check = async (req, res, next) => {
  if (!req.body.riderId || req.body.riderId === "") {
    return res.status(400).json({ error: "riderId is required" });
  }
  if (!req.body.rating || req.body.rating === "") {
    return res.status(400).json({ error: "rating is required" });
  }
  if (req.ride.rider.toString() !== req.body.riderId) {
    console.log(req.ride.rider.toString());
    console.log(req.body.riderId);
    return res
      .status(401)
      .json({ error: "Unauthorized! You can't rate this ride." });
  }
  const rider = await Rider.findById(req.body.riderId);
  if (!rider) {
    return res.status(404).json({ error: "Rider Not Found" });
  }

  req.rider = rider;
  next();
};

module.exports = check;
