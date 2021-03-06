const { getGreatCircleBearing, computeDestinationPoint } = require('geolib');
const haversine = require('s-haversine');

exports.findMidPoint = (points, midDistance) => {
  let distance = 0;
  let leg = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    leg = haversine.default.distance(points[i], points[i + 1]);
    if (distance + leg > midDistance) {
      const [lat1, lng1] = points[i];
      const [lat2, lng2] = points[i + 1];
      const distanceToMidPoint = midDistance - distance;
      const bearing = getGreatCircleBearing([lng1, lat1], [lng2, lat2]);
      const midPoint = computeDestinationPoint(
        [lng1, lat1],
        distanceToMidPoint,
        bearing,
      );
      return midPoint;
    }
    distance += leg;
  }
  return {};
};
