const express = require('express');
const router = express.Router();
const Cow = require('../models/Cow');
const MilkProduction = require('../models/MilkProduction');
const HealthRecord = require('../models/HealthRecord');
const Breeding = require('../models/Breeding');
const { protect, authorize } = require('../middleware/auth');

// Get all dashboard data
router.get('/', protect, async (req, res) => {
    try {
        const { timeRange = 'month' } = req.query;
        const userId = req.user.id;

        // Get date range based on timeRange
        const dateRange = getDateRange(timeRange);

        // Get basic stats
        const [totalCows, activeCows, totalVets, totalShops] = await Promise.all([
            Cow.countDocuments({ userId }),
            Cow.countDocuments({ userId, status: 'active' }),
            Vet.countDocuments(),
            Shop.countDocuments()
        ]);

        // Get health metrics
        const healthMetrics = await getHealthMetrics(userId, dateRange);

        // Get financial metrics
        const financialMetrics = await getFinancialMetrics(userId, dateRange);

        // Get breeding stats
        const breedingStats = await getBreedingStats(userId, dateRange);

        // Get cow distribution
        const cowDistribution = await getCowDistribution(userId);

        // Get milk production
        const milkProduction = await getMilkProduction(userId, dateRange);

        // Get vaccination status
        const vaccinationStatus = await getVaccinationStatus(userId);

        // Get age distribution
        const ageDistribution = await getAgeDistribution(userId);

        // Get recent activities
        const recentActivities = await getRecentActivities(userId, dateRange);

        // Get health alerts
        const healthAlerts = await getHealthAlerts(userId);

        res.json({
            totalCows,
            activeCows,
            totalVets,
            totalShops,
            healthMetrics,
            financialMetrics,
            breedingStats,
            cowDistribution,
            milkProduction,
            vaccinationStatus,
            ageDistribution,
            recentActivities,
            healthAlerts
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
});

// Helper functions
const getDateRange = (timeRange) => {
    const now = new Date();
    const start = new Date();

    switch (timeRange) {
        case 'week':
            start.setDate(now.getDate() - 7);
            break;
        case 'month':
            start.setMonth(now.getMonth() - 1);
            break;
        case 'year':
            start.setFullYear(now.getFullYear() - 1);
            break;
        default:
            start.setMonth(now.getMonth() - 1);
    }

    return { start, end: now };
};

const getHealthMetrics = async (userId, dateRange) => {
    const healthRecords = await HealthRecord.find({
        userId,
        date: { $gte: dateRange.start, $lte: dateRange.end }
    });

    const metrics = {
        healthy: 0,
        underTreatment: 0,
        critical: 0
    };

    healthRecords.forEach(record => {
        if (record.status === 'healthy') metrics.healthy++;
        else if (record.status === 'underTreatment') metrics.underTreatment++;
        else if (record.status === 'critical') metrics.critical++;
    });

    return Object.entries(metrics).map(([name, value]) => ({
        name,
        value
    }));
};

const getFinancialMetrics = async (userId, dateRange) => {
    // This is a placeholder. Implement actual financial calculations based on your data model
    return {
        monthlyRevenue: 25000,
        monthlyExpenses: 15000,
        profitMargin: 40,
        monthlyData: [
            { month: 'Jan', revenue: 20000, expenses: 12000 },
            { month: 'Feb', revenue: 22000, expenses: 13000 },
            { month: 'Mar', revenue: 25000, expenses: 15000 }
        ]
    };
};

const getBreedingStats = async (userId, dateRange) => {
    const breedings = await Breeding.find({
        userId,
        date: { $gte: dateRange.start, $lte: dateRange.end }
    });

    const successfulBreedings = breedings.filter(b => b.status === 'successful').length;
    const upcomingBreedings = breedings.filter(b => b.status === 'scheduled').length;
    const breedingSuccessRate = breedings.length > 0 
        ? (successfulBreedings / breedings.length) * 100 
        : 0;

    // Get monthly breeding data
    const monthlyBreedings = await Breeding.aggregate([
        {
            $match: {
                userId,
                date: { $gte: dateRange.start, $lte: dateRange.end }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                total: { $sum: 1 },
                successful: {
                    $sum: { $cond: [{ $eq: ["$status", "successful"] }, 1, 0] }
                }
            }
        },
        {
            $project: {
                _id: 0,
                month: "$_id",
                total: 1,
                successful: 1
            }
        },
        { $sort: { month: 1 } }
    ]);

    return {
        successfulBreedings,
        upcomingBreedings,
        breedingSuccessRate,
        monthlyBreedings
    };
};

const getCowDistribution = async (userId) => {
    const cows = await Cow.find({ userId });
    
    // Group by status
    const distribution = cows.reduce((acc, cow) => {
        const status = cow.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(distribution).map(([name, value]) => ({
        name,
        value
    }));
};

const getMilkProduction = async (userId, dateRange) => {
    const production = await MilkProduction.aggregate([
        {
            $match: {
                userId,
                date: { $gte: dateRange.start, $lte: dateRange.end }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                quantity: { $sum: '$totalQuantity' }
            }
        },
        {
            $project: {
                _id: 0,
                date: '$_id',
                quantity: 1
            }
        },
        { $sort: { date: 1 } }
    ]);

    return production;
};

const getVaccinationStatus = async (userId) => {
    // This is a placeholder. Implement actual vaccination status based on your data model
    return {
        upToDate: 80,
        dueSoon: 15,
        overdue: 5
    };
};

const getAgeDistribution = async (userId) => {
    // This is a placeholder. Implement actual age distribution based on your data model
    return {
        '0-1 years': 20,
        '1-3 years': 40,
        '3-5 years': 30,
        '5+ years': 10
    };
};

const getRecentActivities = async (userId, dateRange) => {
    // Combine activities from different collections
    const [healthActivities, breedingActivities, milkActivities] = await Promise.all([
        HealthRecord.find({
            userId,
            date: { $gte: dateRange.start, $lte: dateRange.end }
        }).sort({ date: -1 }).limit(5),
        Breeding.find({
            userId,
            date: { $gte: dateRange.start, $lte: dateRange.end }
        }).sort({ date: -1 }).limit(5),
        MilkProduction.find({
            userId,
            date: { $gte: dateRange.start, $lte: dateRange.end }
        }).sort({ date: -1 }).limit(5)
    ]);

    // Combine and format activities
    const activities = [
        ...healthActivities.map(record => ({
            description: `Health check for ${record.cowName}: ${record.condition}`,
            timestamp: record.date
        })),
        ...breedingActivities.map(record => ({
            description: `Breeding ${record.status} for ${record.cowName}`,
            timestamp: record.date
        })),
        ...milkActivities.map(record => ({
            description: `Milk production recorded for ${record.cowName}: ${record.quantity}L`,
            timestamp: record.date
        }))
    ];

    // Sort by timestamp and limit to 10 most recent
    return activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
};

const getHealthAlerts = async (userId) => {
    const alerts = await HealthRecord.find({
        userId,
        status: 'critical'
    }).sort({ date: -1 }).limit(5);

    return alerts.map(alert => ({
        title: `Health Alert: ${alert.condition}`,
        description: `Cow ${alert.cowName} requires immediate attention`,
        time: alert.date
    }));
};

module.exports = router; 