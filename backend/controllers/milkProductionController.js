const MilkProduction = require('../models/MilkProduction');
const Cow = require('../models/Cow');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all milk production records
// @route   GET /api/milk-production
// @access  Private
exports.getMilkProductionRecords = async (req, res, next) => {
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
        query = MilkProduction.find(JSON.parse(queryStr))
            .populate('cow');

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
        const total = await MilkProduction.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const milkProductionRecords = await query;

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
            count: milkProductionRecords.length,
            pagination,
            data: milkProductionRecords
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single milk production record
// @route   GET /api/milk-production/:id
// @access  Private
exports.getMilkProductionRecord = async (req, res, next) => {
    try {
        const milkProductionRecord = await MilkProduction.findById(req.params.id)
            .populate('cow');

        if (!milkProductionRecord) {
            return next(
                new ErrorResponse(`Milk production record not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: milkProductionRecord
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new milk production record
// @route   POST /api/milk-production
// @access  Private
exports.createMilkProductionRecord = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.userId = req.user.id;

        const milkProductionRecord = await MilkProduction.create(req.body);

        // Update cow's milk production records
        await Cow.findByIdAndUpdate(req.body.cow, {
            $push: { milkProduction: milkProductionRecord._id }
        });

        res.status(201).json({
            success: true,
            data: milkProductionRecord
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update milk production record
// @route   PUT /api/milk-production/:id
// @access  Private
exports.updateMilkProductionRecord = async (req, res, next) => {
    try {
        let milkProductionRecord = await MilkProduction.findById(req.params.id);

        if (!milkProductionRecord) {
            return next(
                new ErrorResponse(`Milk production record not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is milk production record owner
        if (milkProductionRecord.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to update this milk production record`,
                    401
                )
            );
        }

        milkProductionRecord = await MilkProduction.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: milkProductionRecord
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete milk production record
// @route   DELETE /api/milk-production/:id
// @access  Private
exports.deleteMilkProductionRecord = async (req, res, next) => {
    try {
        const milkProductionRecord = await MilkProduction.findById(req.params.id);

        if (!milkProductionRecord) {
            return next(
                new ErrorResponse(`Milk production record not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is milk production record owner
        if (milkProductionRecord.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to delete this milk production record`,
                    401
                )
            );
        }

        // Remove milk production record from cow's records
        await Cow.findByIdAndUpdate(milkProductionRecord.cow, {
            $pull: { milkProduction: milkProductionRecord._id }
        });

        await milkProductionRecord.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get milk production statistics
// @route   GET /api/milk-production/statistics
// @access  Private
exports.getMilkProductionStatistics = async (req, res, next) => {
    try {
        const milkProductionRecords = await MilkProduction.find()
            .populate('cow');

        // Calculate statistics
        const statistics = {
            totalRecords: milkProductionRecords.length,
            totalProduction: milkProductionRecords.reduce((sum, record) => sum + record.quantity, 0),
            averageProduction: milkProductionRecords.length > 0 
                ? milkProductionRecords.reduce((sum, record) => sum + record.quantity, 0) / milkProductionRecords.length 
                : 0,
            productionByCow: milkProductionRecords.reduce((acc, record) => {
                if (record.cow) {
                    acc[record.cow.name] = (acc[record.cow.name] || 0) + record.quantity;
                }
                return acc;
            }, {}),
            recentRecords: milkProductionRecords.slice(-5),
            productionByDate: milkProductionRecords.reduce((acc, record) => {
                const date = record.date.toISOString().split('T')[0];
                acc[date] = (acc[date] || 0) + record.quantity;
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