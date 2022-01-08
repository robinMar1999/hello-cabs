const checkSrcDestError = (req, res, next) => {
  const { body } = req;
  if (
    !body.source ||
    !body.source.x_cordinate ||
    body.source.x_cordinate === ""
  ) {
    return res.status(400).json("x_cordinate is required in source");
  }
  if (
    !body.source ||
    !body.source.y_cordinate ||
    body.source.y_cordinate === ""
  ) {
    return res.status(400).json("y_cordinate is required in source");
  }
  if (
    !body.destination ||
    !body.destination.x_cordinate ||
    body.destination.x_cordinate === ""
  ) {
    return res.status(400).json("x_cordinate is required in destination");
  }
  if (
    !body.destination ||
    !body.destination.y_cordinate ||
    body.destination.y_cordinate === ""
  ) {
    return res.status(400).json("y_cordinate is required in destination");
  }
  next();
};

module.exports = checkSrcDestError;
