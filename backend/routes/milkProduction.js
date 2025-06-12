const express = require('express');
const router = express.Router();
const MilkProduction = require('../models/MilkProduction');
const { protect, authorize } = require('../middleware/auth');

// Get all milk production records
router.get('/', protect, async (req, res) => {
    try {
        const records = await MilkProduction.find()
            .populate('cowId', 'name tag')
            .populate('recordedBy', 'name');
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get milk production records for a specific cow
router.get('/cow/:cowId', protect, async (req, res) => {
    try {
        const records = await MilkProduction.find({ cowId: req.params.cowId })
            .populate('cowId', 'name tag')
            .populate('recordedBy', 'name');
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get milk production records by date range
router.get('/date-range', protect, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const records = await MilkProduction.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).populate('cowId', 'name tag')
          .populate('recordedBy', 'name');
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new milk production record
router.post('/', protect, async (req, res) => {
    try {
        const record = new MilkProduction({
            ...req.body,
            recordedBy: req.user.id
        });
        const newRecord = await record.save();
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update milk production record
router.put('/:id', protect, async (req, res) => {
    try {
        const record = await MilkProduction.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json(record);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete milk production record
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const record = await MilkProduction.findByIdAndDelete(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json({ message: 'Record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get milk production statistics
router.get('/stats', protect, async (req, res) => {
    try {
        const stats = await MilkProduction.aggregate([
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: '$totalQuantity' },
                    avgFat: { $avg: '$averageQuality.fat' },
                    avgProtein: { $avg: '$averageQuality.protein' },
                    avgLactose: { $avg: '$averageQuality.lactose' },
                    avgSolids: { $avg: '$averageQuality.solids' }
                }
            }
        ]);
        res.json(stats[0] || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 