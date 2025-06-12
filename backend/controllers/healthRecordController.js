const HealthRecord = require('../models/HealthRecord');
const Cow = require('../models/Cow');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all health records
// @route   GET /api/health-records
// @access  Private
exports.getHealthRecords = async (req, res, next) => {
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
        query = HealthRecord.find(JSON.parse(queryStr))
            .populate('cow')
            .populate('vet');

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
            query = query.sort('-date');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await HealthRecord.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const healthRecords = await query;

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
            count: healthRecords.length,
            pagination,
            data: healthRecords
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single health record
// @route   GET /api/health-records/:id
// @access  Private
exports.getHealthRecord = async (req, res, next) => {
    try {
        const healthRecord = await HealthRecord.findById(req.params.id)
            .populate('cow')
            .populate('vet');

        if (!healthRecord) {
            return next(
                new ErrorResponse(`Health record not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: healthRecord
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new health record
// @route   POST /api/health-records
// @access  Private
exports.createHealthRecord = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.userId = req.user.id;

        const healthRecord = await HealthRecord.create(req.body);

        // Update cow's health records
        await Cow.findByIdAndUpdate(req.body.cow, {
            $push: { healthRecords: healthRecord._id }
        });

        res.status(201).json({
            success: true,
            data: healthRecord
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update health record
// @route   PUT /api/health-records/:id
// @access  Private
exports.updateHealthRecord = async (req, res, next) => {
    try {
        let healthRecord = await HealthRecord.findById(req.params.id);

        if (!healthRecord) {
            return next(
                new ErrorResponse(`Health record not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is health record owner
        if (healthRecord.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to update this health record`,
                    401
                )
            );
        }

        healthRecord = await HealthRecord.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: healthRecord
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete health record
// @route   DELETE /api/health-records/:id
// @access  Private
exports.deleteHealthRecord = async (req, res, next) => {
    try {
        const healthRecord = await HealthRecord.findById(req.params.id);

        if (!healthRecord) {
            return next(
                new ErrorResponse(`Health record not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is health record owner
        if (healthRecord.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to delete this health record`,
                    401
                )
            );
        }

        // Remove health record from cow's records
        await Cow.findByIdAndUpdate(healthRecord.cow, {
            $pull: { healthRecords: healthRecord._id }
        });

        await healthRecord.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get health statistics
// @route   GET /api/health-records/statistics
// @access  Private
exports.getHealthStatistics = async (req, res, next) => {
    try {
        const healthRecords = await HealthRecord.find()
            .populate('cow')
            .populate('vet');

        // Calculate statistics
        const statistics = {
            totalRecords: healthRecords.length,
            recordsByType: healthRecords.reduce((acc, record) => {
                acc[record.type] = (acc[record.type] || 0) + 1;
                return acc;
            }, {}),
            recordsByStatus: healthRecords.reduce((acc, record) => {
                acc[record.status] = (acc[record.status] || 0) + 1;
                return acc;
            }, {}),
            recordsByVet: healthRecords.reduce((acc, record) => {
                if (record.vet) {
                    acc[record.vet.name] = (acc[record.vet.name] || 0) + 1;
                }
                return acc;
            }, {}),
            recentRecords: healthRecords.slice(-5),
            averageTreatmentCost: healthRecords
                .filter(record => record.cost)
                .reduce((sum, record) => sum + record.cost, 0) / 
                healthRecords.filter(record => record.cost).length || 0
        };

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (err) {
        next(err);
    }
}; 