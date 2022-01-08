const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const riderSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  currentlyInRide: {
    type: Boolean,
    default: false,
  },
  walletBalance: {
    type: Number,
    default: 10000000,
  },
  rideId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: "ride",
  },
});

module.exports = Rider = mongoose.model("rider", riderSchema);
