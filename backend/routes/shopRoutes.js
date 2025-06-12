const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const auth = require('../middleware/auth');

// Get all shops with filters
router.get('/', async (req, res) => {
    try {
        const {
            category,
            rating,
            search,
            lat,
            lng,
            radius,
            delivery,
            paymentMethod,
            isOpen,
            priceRange,
            distance,
            sortBy
        } = req.query;

        let query = {};

        // Category filter
        if (category && category !== 'all') {
            query.category = category;
        }

        // Rating filter
        if (rating && rating !== 'all') {
            query['rating.average'] = { $gte: parseFloat(rating) };
        }

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'address.city': { $regex: search, $options: 'i' } }
            ];
        }

        // Location filter
        if (lat && lng) {
            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: radius ? parseInt(radius) * 1000 : 50000 // Convert km to meters
                }
            };
        }

        // Delivery filter
        if (delivery === 'true') {
            query['deliveryOptions.available'] = true;
        }

        // Payment method filter
        if (paymentMethod && paymentMethod !== 'all') {
            query.paymentMethods = paymentMethod;
        }

        // Price range filter
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            query['priceRanges'] = {
                $elemMatch: {
                    minPrice: { $gte: min },
                    maxPrice: { $lte: max }
                }
            };
        }

        // Distance filter
        if (distance) {
            const maxDistance = parseInt(distance);
            if (lat && lng) {
                query.location = {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(lng), parseFloat(lat)]
                        },
                        $maxDistance: maxDistance * 1000 // Convert km to meters
                    }
                };
            }
        }

        // Open now filter
        if (isOpen === 'true') {
            const now = new Date();
            const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
            const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
            
            query['availability'] = {
                $elemMatch: {
                    day,
                    openTime: { $lte: currentTime },
                    closeTime: { $gte: currentTime },
                    isOpen: true
                }
            };
        }

        let shops = await Shop.find(query);

        // Sort results
        if (sortBy) {
            switch (sortBy) {
                case 'rating':
                    shops.sort((a, b) => b.rating.average - a.rating.average);
                    break;
                case 'distance':
                    if (lat && lng) {
                        shops.forEach(shop => {
                            shop.distance = shop.calculateDistance(parseFloat(lat), parseFloat(lng));
                        });
                        shops.sort((a, b) => a.distance - b.distance);
                    }
                    break;
                case 'price':
                    shops.sort((a, b) => {
                        const aMin = Math.min(...a.priceRanges.map(p => p.minPrice));
                        const bMin = Math.min(...b.priceRanges.map(p => p.minPrice));
                        return aMin - bMin;
                    });
                    break;
            }
        }

        res.json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get shop by ID
router.get('/:id', async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        
        // Update view analytics
        await shop.updateAnalytics('view');
        
        res.json(shop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add review to shop
router.post('/:id/reviews', auth, async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        const review = {
            userId: req.user._id,
            rating: req.body.rating,
            comment: req.body.comment,
            images: req.body.images || []
        };

        shop.reviews.push(review);
        await shop.save();
        await shop.updateAnalytics('review');

        res.status(201).json(shop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Toggle favorite shop
router.post('/:id/favorite', auth, async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        await shop.updateAnalytics('favorite');
        res.json({ message: 'Shop favorited successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get shop analytics
router.get('/:id/analytics', auth, async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        res.json(shop.analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Compare shops
router.post('/compare', async (req, res) => {
    try {
        const { shopIds } = req.body;
        const shops = await Shop.find({ _id: { $in: shopIds } });

        const comparison = shops.map(shop => ({
            id: shop._id,
            name: shop.name,
            category: shop.category,
            rating: shop.rating,
            priceRanges: shop.priceRanges,
            services: shop.services,
            features: shop.features,
            deliveryOptions: shop.deliveryOptions,
            paymentMethods: shop.paymentMethods,
            analytics: shop.analytics
        }));

        res.json(comparison);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get shop availability
router.get('/:id/availability', async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        const now = new Date();
        const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
        const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
        
        const todaySchedule = shop.availability.find(schedule => schedule.day === day);
        const isOpen = todaySchedule && 
                      todaySchedule.isOpen && 
                      currentTime >= todaySchedule.openTime && 
                      currentTime <= todaySchedule.closeTime;

        res.json({
            isOpen,
            schedule: todaySchedule,
            nextOpening: shop.availability.find(schedule => 
                schedule.day !== day && schedule.isOpen
            )
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 