const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return next(
                new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
            );
        }

        await user.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get user notifications
// @route   GET /api/users/:id/notifications
// @access  Private
exports.getUserNotifications = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: user.notifications
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/users/:id/notifications/:notificationId
// @access  Private
exports.markNotificationAsRead = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
            );
        }

        await user.markNotificationAsRead(req.params.notificationId);

        res.status(200).json({
            success: true,
            data: user.notifications
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get user favorites
// @route   GET /api/users/:id/favorites
// @access  Private
exports.getUserFavorites = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('favorites.vets')
            .populate('favorites.shops');

        if (!user) {
            return next(
                new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: user.favorites
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Add to favorites
// @route   POST /api/users/:id/favorites
// @access  Private
exports.addToFavorites = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
            );
        }

        await user.addToFavorites(req.body.type, req.body.id);

        res.status(200).json({
            success: true,
            data: user.favorites
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Remove from favorites
// @route   DELETE /api/users/:id/favorites
// @access  Private
exports.removeFromFavorites = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
            );
        }

        await user.removeFromFavorites(req.body.type, req.body.id);

        res.status(200).json({
            success: true,
            data: user.favorites
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user preferences
// @route   PUT /api/users/:id/preferences
// @access  Private
exports.updatePreferences = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
            );
        }

        user.preferences = {
            ...user.preferences,
            ...req.body
        };

        await user.save();

        res.status(200).json({
            success: true,
            data: user.preferences
        });
    } catch (err) {
        next(err);
    }
}; 