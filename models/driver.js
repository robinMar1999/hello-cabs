const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const driverSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "Free",
  },
  position: {
    x_cordinate: {
      type: Number,
      required: true,
    },
    y_cordinate: {
      type: Number,
      required: true,
    },
  },
  total_rides: {
    type: Number,
    default: 0,
  },
  rideId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: "ride",
  },
});

module.exports = Driver = mongoose.model("driver", driverSchema);
