const Driver = require("../models/driver");

const drivers = [
  {
    name: "Ramesh",
    position: {
      x_cordinate: 3,
      y_cordinate: 5,
    },
  },
  {
    name: "Suresh",
    position: {
      x_cordinate: 10,
      y_cordinate: 15,
    },
  },
  {
    name: "Naman",
    position: {
      x_cordinate: 20,
      y_cordinate: 3,
    },
  },
  {
    name: "Anurag",
    position: {
      x_cordinate: 2,
      y_cordinate: 100,
    },
  },
  {
    name: "Mohit",
    position: {
      x_cordinate: 7,
      y_cordinate: 10,
    },
  },
  {
    name: "Bhavishya",
    position: {
      x_cordinate: 70,
      y_cordinate: 33,
    },
  },
  {
    name: "Ankit",
    position: {
      x_cordinate: 30,
      y_cordinate: 47,
    },
  },
];

const initDriverCollection = async () => {
  try {
    await Driver.deleteMany();
    const res = await Driver.insertMany(drivers);
    console.log("Driver Collection Initialized...");
  } catch (err) {
    console.log(err);
  }
};

module.exports = initDriverCollection;
