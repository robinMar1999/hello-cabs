const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const rideSchema = new Schema({
  rideStartTime: {
    type: Date,
    default: null,
  },
  source: {
    x_cordinate: {
      type: Number,
      required: true,
    },
    y_cordinate: {
      type: Number,
      required: true,
    },
  },
  destination: {
    x_cordinate: {
      type: Number,
      required: true,
    },
    y_cordinate: {
      type: Number,
      required: true,
    },
  },
  durationInMins: {
    type: Number,
    required: true,
  },
  costInRupees: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Live",
  },
  rated: {
    type: Boolean,
    default: false,
  },
  rider: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "rider",
  },
  driver: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "driver",
  },
});

module.exports = Ride = mongoose.model("ride", rideSchema);
