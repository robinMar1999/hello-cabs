const express = require("express");
const router = express.Router();
const calculateDistance = require("../utils/calculateDistance");
const Driver = require("../models/driver");
const Ride = require("../models/ride");
const checkSrcDestError = require("../middlewares/checkSrcDestError");
const checkRideId = require("../middlewares/checkRideId");
const checkRatingRiderId = require("../middlewares/checkRatingRiderId");
const Rider = require("../models/rider");

router.get("/showDetailsForRide", checkSrcDestError, (req, res) => {
  try {
    const { body } = req;
    const distance = calculateDistance(body.source, body.destination);
    res.json({
      timeNeededInMinutes: distance,
      costInRupees: distance * 2,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/getNearByCabs", async (req, res) => {
  try {
    const { body } = req;
    if (!body.location) {
      return res.status(400).json({ error: "location is required" });
    }
    if (!body.location.x_cordinate || body.location.x_cordinate === "") {
      return res.status(400).json({
        error: "x_cordinate in location is required and cannot be empty",
      });
    }
    if (!body.location.y_cordinate || body.location.y_cordinate === "") {
      return res.status(400).json({
        error: "y_cordinate in location is required and cannot be empty",
      });
    }
    if (!body.radiusInMeters || body.radiusInMeters === "") {
      return res.status(400).json({
        error: "radiusInMeters is required and cannot be empty",
      });
    }
    const drivers = await Driver.find({ status: "Free" }).select(
      "-__v -status -rideId"
    );
    const ret = [];
    for (let driver of drivers) {
      const distance = calculateDistance(body.location, driver.position);
      if (distance <= parseFloat(body.radiusInMeters)) {
        ret.push(driver);
      }
    }
    res.json(ret);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.patch("/bookCab", checkSrcDestError, async (req, res) => {
  try {
    if (!req.query.riderId || req.query.riderId === "") {
      return res.status(400).json({ error: "Riderid is needed" });
    }
    const rider = await Rider.findById(req.query.riderId);
    if (!rider) {
      return res.status(404).json({ error: "Rider not found" });
    }
    if (rider.currentlyInRide) {
      return res.status(400).json({ error: "Rider has already booked a cab" });
    }
    const { body } = req;
    let driverToBook = null;
    if (!req.query.automatch || req.query.automatch === "true") {
      const drivers = await Driver.find({ status: "Free" });
      if (drivers.length === 0) {
        return res.status(404).json({ error: "No Cabs Found to Book" });
      }

      let dist = null;
      let rating = 0;
      for (let driver of drivers) {
        const dist1 = calculateDistance(driver.position, body.source);
        if (!dist) {
          driverToBook = driver;
          rating = driver.rating;
          dist = dist1;
        } else if (dist > dist1) {
          driverToBook = driver;
          rating = driver.rating;
          dist = dist1;
        } else if (dist === dist1 && driver.rating > rating) {
          driverToBook = driver;
          rating = driver.rating;
          dist = dist1;
        }
      }
    } else {
      if (!req.body.driverId) {
        return res.status(400).json({ error: "DriverId is needed" });
      }
      driverToBook = await Driver.findById(req.body.driverId);
      if (!driverToBook) {
        return res.status(404).json({ error: "Driver Not Found" });
      }
      if (driverToBook.status !== "Free") {
        return res.status(400).json({ error: "Driver already occupied" });
      }
    }
    const distSrcDest = calculateDistance(body.source, body.destination);
    const ride = new Ride({
      source: {
        x_cordinate: body.source.x_cordinate,
        y_cordinate: body.source.y_cordinate,
      },
      destination: {
        x_cordinate: body.destination.x_cordinate,
        y_cordinate: body.destination.y_cordinate,
      },
      durationInMins: distSrcDest,
      costInRupees: distSrcDest * 2,
      rider: rider,
      driver: driverToBook,
    });
    driverToBook.status = "ToBePickedUp";
    driverToBook.rideId = ride._id;
    rider.rideId = ride._id;
    rider.currentlyInRide = true;
    await rider.save();
    await ride.save();
    await driverToBook.save();
    res.json({
      driverDetails: {
        _id: driverToBook._id,
        name: driverToBook.name,
        driverLocation: driverToBook.position,
      },
      rideId: ride._id,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.patch("/startRide", checkRideId, async (req, res) => {
  try {
    const { ride } = req;
    if (ride.rideStartTime) {
      return res.status(400).json({ error: "Ride has already started" });
    }
    const driver = await Driver.findById(req.ride.driver);
    driver.status = "RideStarted";
    ride.rideStartTime = new Date();
    await driver.save();
    await req.ride.save();
    res.json({ msg: "Ride has started" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.patch("/endRide", checkRideId, async (req, res) => {
  try {
    const { ride } = req;
    if (!ride.rideStartTime) {
      return res.status(400).json({ error: "Ride has not started yet" });
    }
    const driver = await Driver.findById(ride.driver);
    const rider = await Rider.findById(ride.rider);
    driver.status = "Free";
    driver.position = {
      x_cordinate: ride.destination.x_cordinate,
      y_cordinate: ride.destination.y_cordinate,
    };
    driver.total_rides++;
    rider.currentlyInRide = false;
    rider.rideId = null;
    rider.walletBalance -= ride.costInRupees;
    ride.status = "Done";
    await rider.save();
    await driver.save();
    await ride.save();
    res.json({ msg: "Ride Completed Successfully" });
  } catch (err) {
    console.log("EndRide", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.patch("/rateRide", checkRideId, checkRatingRiderId, async (req, res) => {
  try {
    const { ride, rider } = req;
    const { rating } = req.body;
    if (ride.status === "Live") {
      return res.status(400).json({ error: "Ride has not finished yet" });
    }
    if (ride.rated) {
      return res.status(400).json({ error: "Ride has already been rated" });
    }
    const driver = await Driver.findById(ride.driver);
    driver.rating =
      (driver.rating * (driver.total_rides - 1) + rating) / driver.total_rides;
    ride.rated = true;
    await ride.save();
    await driver.save();
    res.json({ msg: "Rating Posted Successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
