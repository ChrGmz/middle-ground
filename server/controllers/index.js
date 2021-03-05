const { getVenuesByMidPointOnRoute } = require('../services/index');

exports.requestVenues = async (req, res) => {
  console.log('I\'m here!');
  const {
    origin,
    destination,
  } = req.body;
  if (!origin || !destination) return res.status(400).json({ error: 'Bad request: Incomplete Request' });
  try {
    console.log('going to try and use the API now!');
    const venues = await getVenuesByMidPointOnRoute(origin, destination);

    return res.status(200).json(venues);
    // console.log('', midPoint);
    // const venues = await getVenues(midPoint);
    // if (!venues) return res.status(500).json({ error: 'Server error' });
    // return res.status(200).json(venues);
  } catch (err) {
    return { error: err };
  }
};
