const Shop = require('../models/Shop');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all shops
// @route   GET /api/shops
// @access  Private
exports.getShops = async (req, res, next) => {
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
        query = Shop.find(JSON.parse(queryStr));

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
        const total = await Shop.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const shops = await query;

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
            count: shops.length,
            pagination,
            data: shops
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single shop
// @route   GET /api/shops/:id
// @access  Private
exports.getShop = async (req, res, next) => {
    try {
        const shop = await Shop.findById(req.params.id)
            .populate('products')
            .populate('orders');

        if (!shop) {
            return next(
                new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: shop
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new shop
// @route   POST /api/shops
// @access  Private/Admin
exports.createShop = async (req, res, next) => {
    try {
        const shop = await Shop.create(req.body);

        res.status(201).json({
            success: true,
            data: shop
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update shop
// @route   PUT /api/shops/:id
// @access  Private/Admin
exports.updateShop = async (req, res, next) => {
    try {
        let shop = await Shop.findById(req.params.id);

        if (!shop) {
            return next(
                new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404)
            );
        }

        shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: shop
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete shop
// @route   DELETE /api/shops/:id
// @access  Private/Admin
exports.deleteShop = async (req, res, next) => {
    try {
        const shop = await Shop.findById(req.params.id);

        if (!shop) {
            return next(
                new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404)
            );
        }

        await shop.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get shop products
// @route   GET /api/shops/:id/products
// @access  Private
exports.getShopProducts = async (req, res, next) => {
    try {
        const shop = await Shop.findById(req.params.id).populate('products');

        if (!shop) {
            return next(
                new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: shop.products
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get shop orders
// @route   GET /api/shops/:id/orders
// @access  Private
exports.getShopOrders = async (req, res, next) => {
    try {
        const shop = await Shop.findById(req.params.id).populate('orders');

        if (!shop) {
            return next(
                new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: shop.orders
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get shop statistics
// @route   GET /api/shops/:id/statistics
// @access  Private
exports.getShopStatistics = async (req, res, next) => {
    try {
        const shop = await Shop.findById(req.params.id)
            .populate('products')
            .populate('orders');

        if (!shop) {
            return next(
                new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404)
            );
        }

        // Calculate statistics
        const statistics = {
            totalProducts: shop.products.length,
            totalOrders: shop.orders.length,
            totalRevenue: shop.orders.reduce((sum, order) => sum + order.totalAmount, 0),
            averageOrderValue: shop.orders.length > 0 
                ? shop.orders.reduce((sum, order) => sum + order.totalAmount, 0) / shop.orders.length 
                : 0,
            topSellingProducts: shop.getTopSellingProducts(5),
            recentOrders: shop.orders.slice(-5)
        };

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (err) {
        next(err);
    }
}; 