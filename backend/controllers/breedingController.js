const Breeding = require('../models/Breeding');
const Cow = require('../models/Cow');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all breeding records
// @route   GET /api/breeding
// @access  Private
exports.getBreedingRecords = async (req, res, next) => {
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
        query = Breeding.find(JSON.parse(queryStr))
            .populate('cow')
            .populate('sire');

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
        const total = await Breeding.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const breedingRecords = await query;

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
            count: breedingRecords.length,
            pagination,
            data: breedingRecords
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single breeding record
// @route   GET /api/breeding/:id
// @access  Private
exports.getBreedingRecord = async (req, res, next) => {
    try {
        const breedingRecord = await Breeding.findById(req.params.id)
            .populate('cow')
            .populate('sire');

        if (!breedingRecord) {
            return next(
                new ErrorResponse(`Breeding record not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: breedingRecord
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new breeding record
// @route   POST /api/breeding
// @access  Private
exports.createBreedingRecord = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.userId = req.user.id;

        const breedingRecord = await Breeding.create(req.body);

        // Update cow's breeding status
        await Cow.findByIdAndUpdate(req.body.cow, {
            $push: { breedingRecords: breedingRecord._id }
        });

        res.status(201).json({
            success: true,
            data: breedingRecord
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update breeding record
// @route   PUT /api/breeding/:id
// @access  Private
exports.updateBreedingRecord = async (req, res, next) => {
    try {
        let breedingRecord = await Breeding.findById(req.params.id);

        if (!breedingRecord) {
            return next(
                new ErrorResponse(`Breeding record not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is breeding record owner
        if (breedingRecord.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to update this breeding record`,
                    401
                )
            );
        }

        breedingRecord = await Breeding.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: breedingRecord
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete breeding record
// @route   DELETE /api/breeding/:id
// @access  Private
exports.deleteBreedingRecord = async (req, res, next) => {
    try {
        const breedingRecord = await Breeding.findById(req.params.id);

        if (!breedingRecord) {
            return next(
                new ErrorResponse(`Breeding record not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is breeding record owner
        if (breedingRecord.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to delete this breeding record`,
                    401
                )
            );
        }

        // Remove breeding record from cow's records
        await Cow.findByIdAndUpdate(breedingRecord.cow, {
            $pull: { breedingRecords: breedingRecord._id }
        });

        await breedingRecord.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get breeding statistics
// @route   GET /api/breeding/statistics
// @access  Private
exports.getBreedingStatistics = async (req, res, next) => {
    try {
        const breedingRecords = await Breeding.find()
            .populate('cow')
            .populate('sire');

        // Calculate statistics
        const statistics = {
            totalRecords: breedingRecords.length,
            successfulBreedings: breedingRecords.filter(record => record.status === 'successful').length,
            successRate: breedingRecords.length > 0 
                ? breedingRecords.filter(record => record.status === 'successful').length / breedingRecords.length 
                : 0,
            averageGestationPeriod: breedingRecords
                .filter(record => record.gestationPeriod)
                .reduce((sum, record) => sum + record.gestationPeriod, 0) / 
                breedingRecords.filter(record => record.gestationPeriod).length || 0,
            recentBreedings: breedingRecords.slice(-5),
            breedingByMethod: breedingRecords.reduce((acc, record) => {
                acc[record.method] = (acc[record.method] || 0) + 1;
                return acc;
            }, {})
        };

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (err) {
        next(err);
    }
}; 