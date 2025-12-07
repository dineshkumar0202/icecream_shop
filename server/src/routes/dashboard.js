const r = require('express').Router();
const ctrl = require('../controllers/dashboardController');
const auth = require('../middleware/authMiddleware');

// All dashboard endpoints require an authenticated user
r.get('/totals', auth(), ctrl.totals);
r.get('/top-flavor', auth(), ctrl.topFlavorByCity);
r.get('/top-flavors', auth(), ctrl.topFlavors);

module.exports = r;
