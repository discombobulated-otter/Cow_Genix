const express = require('express');
const {
    getShops,
    getShop,
    createShop,
    updateShop,
    deleteShop,
    getShopProducts,
    getShopOrders,
    getShopStatistics
} = require('../controllers/shopController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes
router.route('/')
    .get(getShops)
    .post(authorize('admin'), createShop);

router.route('/:id')
    .get(getShop)
    .put(authorize('admin'), updateShop)
    .delete(authorize('admin'), deleteShop);

router.route('/:id/products')
    .get(getShopProducts);

router.route('/:id/orders')
    .get(getShopOrders);

router.route('/:id/statistics')
    .get(getShopStatistics);

module.exports = router; 