const express = require('express');
const {
    getVets,
    getVet,
    createVet,
    updateVet,
    deleteVet,
    getVetAppointments,
    getVetSchedule,
    getVetStatistics
} = require('../controllers/vetController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes
router.route('/')
    .get(getVets)
    .post(authorize('admin'), createVet);

router.route('/:id')
    .get(getVet)
    .put(authorize('admin'), updateVet)
    .delete(authorize('admin'), deleteVet);

router.route('/:id/appointments')
    .get(getVetAppointments);

router.route('/:id/schedule')
    .get(getVetSchedule);

router.route('/:id/statistics')
    .get(getVetStatistics);

module.exports = router; 