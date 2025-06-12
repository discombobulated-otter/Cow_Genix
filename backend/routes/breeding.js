const express = require('express');
const {
    getBreedingRecords,
    getBreedingRecord,
    createBreedingRecord,
    updateBreedingRecord,
    deleteBreedingRecord,
    getBreedingStatistics
} = require('../controllers/breedingController');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes
router.route('/')
    .get(getBreedingRecords)
    .post(createBreedingRecord);

router.route('/:id')
    .get(getBreedingRecord)
    .put(updateBreedingRecord)
    .delete(deleteBreedingRecord);

router.route('/statistics')
    .get(getBreedingStatistics);

module.exports = router; 