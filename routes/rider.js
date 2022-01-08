const express = require("express");
const Rider = require("../models/rider");
const Ride = require("../models/ride");

const router = express.Router();

router.get("/getRider", async (req, res) => {
  try {
    if (!req.query.id) {
      return res.json({ error: "Please provide rider id" });
    }
    const rider = await Rider.findById(req.query.id).select("-_id -__v");
    res.json(rider);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/getMyRides", async (req, res) => {
  try {
    if (!req.query.id) {
      return res.json({ error: "Please provide rider id" });
    }
    const rides = await Ride.find({ rider: req.query.id }).select(
      "-_id -rider -__v"
    );
    res.json(rides);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
