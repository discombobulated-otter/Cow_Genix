const Cow = require('../models/Cow');
const Vet = require('../models/Vet');
const Shop = require('../models/Shop');
const Breeding = require('../models/Breeding');
const HealthRecord = require('../models/HealthRecord');
const MilkProduction = require('../models/MilkProduction');

const dashboardController = {
    // Get all dashboard data
    getDashboardData: async (req, res) => {
        try {
            const { timeRange } = req.query;
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
    }
};

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

    // Group by health condition and calculate metrics
    const metrics = healthRecords.reduce((acc, record) => {
        const condition = record.condition;
        if (!acc[condition]) {
            acc[condition] = { value: 0, target: 0 };
        }
        acc[condition].value++;
        return acc;
    }, {});

    return Object.entries(metrics).map(([name, data]) => ({
        name,
        value: data.value,
        target: 0 // Set appropriate targets based on your requirements
    }));
};

const getFinancialMetrics = async (userId, dateRange) => {
    // Implement financial metrics calculation
    // This is a placeholder - implement based on your financial data structure
    return {
        monthlyRevenue: 0,
        monthlyExpenses: 0,
        profitMargin: 0,
        monthlyData: []
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
    
    // Group by breed
    const distribution = cows.reduce((acc, cow) => {
        const breed = cow.breed;
        acc[breed] = (acc[breed] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(distribution).map(([name, value]) => ({
        name,
        value
    }));
};

const getMilkProduction = async (userId, dateRange) => {
    const production = await MilkProduction.find({
        userId,
        date: { $gte: dateRange.start, $lte: dateRange.end }
    });

    // Calculate average production by cow
    const productionByCow = production.reduce((acc, record) => {
        const cowId = record.cowId.toString();
        if (!acc[cowId]) {
            acc[cowId] = { total: 0, count: 0 };
        }
        acc[cowId].total += record.quantity;
        acc[cowId].count++;
        return acc;
    }, {});

    // Get cow names
    const cowIds = Object.keys(productionByCow);
    const cows = await Cow.find({ _id: { $in: cowIds } });
    const cowMap = cows.reduce((acc, cow) => {
        acc[cow._id.toString()] = cow.name;
        return acc;
    }, {});

    return Object.entries(productionByCow).map(([cowId, data]) => ({
        subject: cowMap[cowId] || 'Unknown',
        value: Math.round(data.total / data.count)
    }));
};

const getVaccinationStatus = async (userId) => {
    const cows = await Cow.find({ userId });
    const now = new Date();

    return cows.map(cow => {
        const lastVaccination = cow.vaccinations[cow.vaccinations.length - 1];
        const daysSinceVaccination = lastVaccination 
            ? Math.floor((now - new Date(lastVaccination.date)) / (1000 * 60 * 60 * 24))
            : Infinity;

        return {
            name: cow.name,
            value: daysSinceVaccination <= 365 ? 100 : 0 // 100% if vaccinated within last year
        };
    });
};

const getAgeDistribution = async (userId) => {
    const cows = await Cow.find({ userId });
    const now = new Date();

    // Calculate age in years
    const ages = cows.map(cow => {
        const birthDate = new Date(cow.birthDate);
        const age = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24 * 365));
        return age;
    });

    // Group by age
    const distribution = ages.reduce((acc, age) => {
        acc[age] = (acc[age] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(distribution).map(([age, count]) => ({
        age: parseInt(age),
        count
    }));
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
    const cows = await Cow.find({ userId });
    const alerts = [];

    for (const cow of cows) {
        // Check for overdue vaccinations
        const lastVaccination = cow.vaccinations[cow.vaccinations.length - 1];
        if (lastVaccination) {
            const daysSinceVaccination = Math.floor(
                (new Date() - new Date(lastVaccination.date)) / (1000 * 60 * 60 * 24)
            );
            if (daysSinceVaccination > 365) {
                alerts.push({
                    message: `${cow.name} needs vaccination`,
                    severity: 'high'
                });
            }
        }

        // Check for health conditions
        const recentHealthRecords = await HealthRecord.find({
            cowId: cow._id,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        });

        if (recentHealthRecords.length > 0) {
            alerts.push({
                message: `${cow.name} has recent health issues`,
                severity: 'medium'
            });
        }
    }

    return alerts;
};

module.exports = dashboardController; 