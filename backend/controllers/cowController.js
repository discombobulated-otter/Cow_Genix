const Cow = require('../models/Cow');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all cows
// @route   GET /api/cows
// @access  Private
exports.getCows = async (req, res, next) => {
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
        query = Cow.find(JSON.parse(queryStr));

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
        const total = await Cow.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const cows = await query;

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
            count: cows.length,
            pagination,
            data: cows
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single cow
// @route   GET /api/cows/:id
// @access  Private
exports.getCow = async (req, res, next) => {
    try {
        const cow = await Cow.findById(req.params.id)
            .populate('healthRecords')
            .populate('breedingRecords')
            .populate('milkProduction');

        if (!cow) {
            return next(
                new ErrorResponse(`Cow not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: cow
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new cow
// @route   POST /api/cows
// @access  Private
exports.createCow = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.userId = req.user.id;

        const cow = await Cow.create(req.body);

        res.status(201).json({
            success: true,
            data: cow
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update cow
// @route   PUT /api/cows/:id
// @access  Private
exports.updateCow = async (req, res, next) => {
    try {
        let cow = await Cow.findById(req.params.id);

        if (!cow) {
            return next(
                new ErrorResponse(`Cow not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is cow owner
        if (cow.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to update this cow`,
                    401
                )
            );
        }

        cow = await Cow.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: cow
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete cow
// @route   DELETE /api/cows/:id
// @access  Private
exports.deleteCow = async (req, res, next) => {
    try {
        const cow = await Cow.findById(req.params.id);

        if (!cow) {
            return next(
                new ErrorResponse(`Cow not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is cow owner
        if (cow.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to delete this cow`,
                    401
                )
            );
        }

        await cow.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get cow health records
// @route   GET /api/cows/:id/health-records
// @access  Private
exports.getCowHealthRecords = async (req, res, next) => {
    try {
        const cow = await Cow.findById(req.params.id).populate('healthRecords');

        if (!cow) {
            return next(
                new ErrorResponse(`Cow not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: cow.healthRecords
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get cow breeding records
// @route   GET /api/cows/:id/breeding-records
// @access  Private
exports.getCowBreedingRecords = async (req, res, next) => {
    try {
        const cow = await Cow.findById(req.params.id).populate('breedingRecords');

        if (!cow) {
            return next(
                new ErrorResponse(`Cow not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: cow.breedingRecords
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get cow milk production
// @route   GET /api/cows/:id/milk-production
// @access  Private
exports.getCowMilkProduction = async (req, res, next) => {
    try {
        const cow = await Cow.findById(req.params.id).populate('milkProduction');

        if (!cow) {
            return next(
                new ErrorResponse(`Cow not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: cow.milkProduction
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get cow statistics
// @route   GET /api/cows/:id/statistics
// @access  Private
exports.getCowStatistics = async (req, res, next) => {
    try {
        const cow = await Cow.findById(req.params.id)
            .populate('healthRecords')
            .populate('breedingRecords')
            .populate('milkProduction');

        if (!cow) {
            return next(
                new ErrorResponse(`Cow not found with id of ${req.params.id}`, 404)
            );
        }

        // Calculate statistics
        const statistics = {
            health: {
                totalRecords: cow.healthRecords.length,
                lastCheckup: cow.getLastHealthRecord(),
                vaccinationStatus: cow.getLastVaccination()
            },
            breeding: {
                totalRecords: cow.breedingRecords.length,
                lastBreeding: cow.breedingRecords[cow.breedingRecords.length - 1],
                successRate: cow.breedingRecords.filter(record => record.status === 'successful').length / cow.breedingRecords.length
            },
            milkProduction: {
                averageProduction: cow.calculateAverageMilkProduction(30), // Last 30 days
                totalProduction: cow.milkProduction.reduce((sum, record) => sum + record.totalQuantity, 0)
            }
        };

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (err) {
        next(err);
    }
}; 