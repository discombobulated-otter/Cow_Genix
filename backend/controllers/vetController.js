const Vet = require('../models/Vet');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all vets
// @route   GET /api/vets
// @access  Private
exports.getVets = async (req, res, next) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Finding resource
        query = Vet.find(JSON.parse(queryStr));

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Vet.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const vets = await query;

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({
            success: true,
            count: vets.length,
            pagination,
            data: vets
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single vet
// @route   GET /api/vets/:id
// @access  Private
exports.getVet = async (req, res, next) => {
    try {
        const vet = await Vet.findById(req.params.id)
            .populate('specializations')
            .populate('appointments');

        if (!vet) {
            return next(
                new ErrorResponse(`Vet not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: vet
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new vet
// @route   POST /api/vets
// @access  Private/Admin
exports.createVet = async (req, res, next) => {
    try {
        const vet = await Vet.create(req.body);

        res.status(201).json({
            success: true,
            data: vet
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update vet
// @route   PUT /api/vets/:id
// @access  Private/Admin
exports.updateVet = async (req, res, next) => {
    try {
        let vet = await Vet.findById(req.params.id);

        if (!vet) {
            return next(
                new ErrorResponse(`Vet not found with id of ${req.params.id}`, 404)
            );
        }

        vet = await Vet.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: vet
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete vet
// @route   DELETE /api/vets/:id
// @access  Private/Admin
exports.deleteVet = async (req, res, next) => {
    try {
        const vet = await Vet.findById(req.params.id);

        if (!vet) {
            return next(
                new ErrorResponse(`Vet not found with id of ${req.params.id}`, 404)
            );
        }

        await vet.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get vet appointments
// @route   GET /api/vets/:id/appointments
// @access  Private
exports.getVetAppointments = async (req, res, next) => {
    try {
        const vet = await Vet.findById(req.params.id).populate('appointments');

        if (!vet) {
            return next(
                new ErrorResponse(`Vet not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: vet.appointments
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get vet schedule
// @route   GET /api/vets/:id/schedule
// @access  Private
exports.getVetSchedule = async (req, res, next) => {
    try {
        const vet = await Vet.findById(req.params.id);

        if (!vet) {
            return next(
                new ErrorResponse(`Vet not found with id of ${req.params.id}`, 404)
            );
        }

        // Get date range from query params or default to current week
        const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
        const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Get appointments within date range
        const appointments = await vet.getAppointmentsInRange(startDate, endDate);

        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get vet statistics
// @route   GET /api/vets/:id/statistics
// @access  Private
exports.getVetStatistics = async (req, res, next) => {
    try {
        const vet = await Vet.findById(req.params.id)
            .populate('appointments')
            .populate('specializations');

        if (!vet) {
            return next(
                new ErrorResponse(`Vet not found with id of ${req.params.id}`, 404)
            );
        }

        // Calculate statistics
        const statistics = {
            totalAppointments: vet.appointments.length,
            completedAppointments: vet.appointments.filter(app => app.status === 'completed').length,
            upcomingAppointments: vet.appointments.filter(app => app.status === 'scheduled').length,
            specializations: vet.specializations,
            averageRating: vet.calculateAverageRating(),
            availability: vet.availability
        };

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (err) {
        next(err);
    }
}; 