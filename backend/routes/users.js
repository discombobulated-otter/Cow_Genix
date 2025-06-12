const express = require('express');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserNotifications,
    markNotificationAsRead,
    getUserFavorites,
    addToFavorites,
    removeFromFavorites,
    updatePreferences
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin only routes
router.route('/')
    .get(authorize('admin'), getUsers)
    .post(authorize('admin'), createUser);

router.route('/:id')
    .get(authorize('admin'), getUser)
    .put(authorize('admin'), updateUser)
    .delete(authorize('admin'), deleteUser);

// User specific routes
router.route('/:id/notifications')
    .get(getUserNotifications);

router.route('/:id/notifications/:notificationId')
    .put(markNotificationAsRead);

router.route('/:id/favorites')
    .get(getUserFavorites)
    .post(addToFavorites)
    .delete(removeFromFavorites);

router.route('/:id/preferences')
    .put(updatePreferences);

module.exports = router; 