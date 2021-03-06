const { Client } = require('@googlemaps/google-maps-services-js');
const { decode } = require('@mapbox/polyline');
const { findMidPoint } = require('./helpers');

const client = new Client({});

exports.getVenuesByMidPointOnRoute = async (origin, destination) => {
  try {
    const response = await client.directions({
      params: {
        origin,
        destination,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    if (response.statusText !== 'OK') return { error: 'Server error' };
    const polyline = response.data.routes[0].overview_polyline.points;
    const distance = response.data.routes[0].legs[0].distance.value;
    const routeCoordinates = decode(polyline);
    const { latitude, longitude } = findMidPoint(routeCoordinates, distance / 2);
    const placesResponse = await client.placesNearby({
      params: {
        radius: 50000,
        location: {
          latitude,
          longitude,
        },
        key: process.env.GOOGLE_MAPS_API_KEY,
        keyword: 'coffee',
      },
    });
    const venues = placesResponse.data.results;
    console.log('Places Response Params Location:', placesResponse.config.params.location);
    return venues;
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};
