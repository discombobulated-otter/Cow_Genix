const express = require('express');
const {
    getCows,
    getCow,
    createCow,
    updateCow,
    deleteCow,
    getCowHealthRecords,
    getCowBreedingRecords,
    getCowMilkProduction,
    getCowStatistics
} = require('../controllers/cowController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes
router.route('/')
    .get(getCows)
    .post(createCow);

router.route('/:id')
    .get(getCow)
    .put(updateCow)
    .delete(deleteCow);

router.route('/:id/health-records')
    .get(getCowHealthRecords);

router.route('/:id/breeding-records')
    .get(getCowBreedingRecords);

router.route('/:id/milk-production')
    .get(getCowMilkProduction);

router.route('/:id/statistics')
    .get(getCowStatistics);

module.exports = router; 