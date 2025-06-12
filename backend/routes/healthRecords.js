const express = require('express');
const {
    getHealthRecords,
    getHealthRecord,
    createHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    getHealthStatistics
} = require('../controllers/healthRecordController');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes
router.route('/')
    .get(getHealthRecords)
    .post(createHealthRecord);

router.route('/:id')
    .get(getHealthRecord)
    .put(updateHealthRecord)
    .delete(deleteHealthRecord);

router.route('/statistics')
    .get(getHealthStatistics);

module.exports = router; 