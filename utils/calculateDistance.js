const calculateDistance = (src, dest) => {
  const dx = Math.abs(
    parseFloat(src.x_cordinate) - parseFloat(dest.x_cordinate)
  );

  const dy = Math.abs(
    parseFloat(dest.y_cordinate) - parseFloat(dest.y_cordinate)
  );
  const distance = Math.round(Math.sqrt(dx * dx + dy * dy));
  return distance;
};

module.exports = calculateDistance;
