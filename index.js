const express = require("express");
const connectDB = require("./db/mongoose");

// Initialize Collection Functions
const initDriverCollection = require("./initCollections/initDriverCollection");
const initRiderCollection = require("./initCollections/initRiderCollection");
const initRideCollection = require("./initCollections/initRideCollection");

const app = express();
const port = process.env.PORT || 5000;

// connect to database
connectDB();

// Initialize Collections
// initDriverCollection();
// initRiderCollection();
// initRideCollection();

app.use(express.json());

app.use("/driver", require("./routes/driver"));
app.use("/rider", require("./routes/rider"));
app.use("/ride", require("./routes/ride"));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
