const Rider = require("../models/rider");

const riders = [
  { name: "Robin" },
  { name: "Aman" },
  { name: "Parveen" },
  { name: "Baljeet" },
  { name: "Isha" },
  { name: "Golu" },
  { name: "Niku" },
  { name: "Sameeksha" },
];

const initRiderCollection = async () => {
  try {
    await Rider.deleteMany();
    const res = await Rider.insertMany(riders);
    console.log("Rider Collection Initialized...");
  } catch (err) {
    console.log(err);
  }
};

module.exports = initRiderCollection;
