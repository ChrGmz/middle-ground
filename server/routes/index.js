const { Router } = require('express');
const { requestVenues } = require('../controllers')

const router = Router();

router.get('/requestvenues', requestVenues);

module.exports = router;
