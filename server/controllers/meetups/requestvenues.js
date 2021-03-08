const { getVenuesByMidPointOnRoute } = require("../../services/google-api-service");
const { MeetUp } = require('../../models/')

exports.requestVenues = async (req, res) => {
  const { location: destination, meetupid: meetUpId } = req.body;
  if (!destination || !meetUpId) return res.status(400).json({ 
    error: 'Bad request: Incomplete Request'
  });
  try {
    const meetUp = await MeetUp.findOne({ id: meetUpId });
    if (!meetUp) return res.status(400).json({ status: 400, error: 'Bad request: Please send with correct paramaters!' });
    const origin = meetUp.get('origin');
    const venues = await getVenuesByMidPointOnRoute(origin, destination);
    return res.status(200).json(venues);
  } catch (err) {
    console.error(err);
    return { error: err };
  }
};