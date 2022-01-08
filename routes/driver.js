const express = require("express");
const Driver = require("../models/driver");
const Ride = require("../models/ride");
const { body, validationResult } = require("express-validator");

const router = express.Router();

router.get("/getAllDrivers", async (req, res) => {
  try {
    const drivers = await Driver.find().select("-__v");
    res.json(drivers);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/getDriver", async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).json({ error: "Please provide driver id" });
    }
    const driver = await Driver.findById(req.query.id).select("-_id -__v");

    if (!driver) {
      return res.status(404).json({ error: "Driver Not Found" });
    }
    res.json(driver);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/getMyRides", async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).json({ error: "Please provide driver id" });
    }
    const rides = await Ride.find({ driver: req.query.id }).select(
      "-driver -_id -__v"
    );
    res.json(rides);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/getDriverPosition", async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).json({ error: "Please provide driver id" });
    }
    const driver = await Driver.findById(req.query.id).select(["position"]);
    console.log(driver);
    res.json({ ...driver.position });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.patch(
  "/updatePosition",
  [
    body("id", "Driver id is required").notEmpty(),
    body("x_cordinate").notEmpty(),
    body("y_cordinate").notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const x_cordinate = parseFloat(req.body.x_cordinate);
      const y_cordinate = parseFloat(req.body.y_cordinate);
      const driver = await Driver.findById(req.body.id);
      driver.position = {
        x_cordinate,
        y_cordinate,
      };
      await driver.save();
      res.json(driver);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

module.exports = router;
