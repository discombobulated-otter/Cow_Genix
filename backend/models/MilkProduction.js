const mongoose = require('mongoose');

const milkProductionSchema = new mongoose.Schema({
    cowId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cow',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    morning: {
        quantity: {
            type: Number,
            required: true,
            min: 0
        },
        quality: {
            fat: {
                type: Number,
                min: 0,
                max: 100
            },
            protein: {
                type: Number,
                min: 0,
                max: 100
            },
            lactose: {
                type: Number,
                min: 0,
                max: 100
            },
            solids: {
                type: Number,
                min: 0,
                max: 100
            }
        },
        temperature: {
            type: Number,
            min: 0
        },
        notes: String
    },
    evening: {
        quantity: {
            type: Number,
            required: true,
            min: 0
        },
        quality: {
            fat: {
                type: Number,
                min: 0,
                max: 100
            },
            protein: {
                type: Number,
                min: 0,
                max: 100
            },
            lactose: {
                type: Number,
                min: 0,
                max: 100
            },
            solids: {
                type: Number,
                min: 0,
                max: 100
            }
        },
        temperature: {
            type: Number,
            min: 0
        },
        notes: String
    },
    totalQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    averageQuality: {
        fat: {
            type: Number,
            min: 0,
            max: 100
        },
        protein: {
            type: Number,
            min: 0,
            max: 100
        },
        lactose: {
            type: Number,
            min: 0,
            max: 100
        },
        solids: {
            type: Number,
            min: 0,
            max: 100
        }
    },
    status: {
        type: String,
        enum: ['normal', 'low', 'high', 'abnormal'],
        default: 'normal'
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes
milkProductionSchema.index({ cowId: 1, date: 1 });
milkProductionSchema.index({ date: 1 });
milkProductionSchema.index({ status: 1 });

// Methods
milkProductionSchema.methods.calculateTotalQuantity = function() {
    this.totalQuantity = (this.morning.quantity || 0) + (this.evening.quantity || 0);
    return this.totalQuantity;
};

milkProductionSchema.methods.calculateAverageQuality = function() {
    const calculateAverage = (morning, evening) => {
        if (!morning && !evening) return null;
        if (!morning) return evening;
        if (!evening) return morning;
        return (morning + evening) / 2;
    };

    this.averageQuality = {
        fat: calculateAverage(this.morning.quality?.fat, this.evening.quality?.fat),
        protein: calculateAverage(this.morning.quality?.protein, this.evening.quality?.protein),
        lactose: calculateAverage(this.morning.quality?.lactose, this.evening.quality?.lactose),
        solids: calculateAverage(this.morning.quality?.solids, this.evening.quality?.solids)
    };

    return this.averageQuality;
};

milkProductionSchema.methods.updateStatus = function() {
    const thresholds = {
        low: 5, // liters
        high: 20, // liters
        abnormal: {
            fat: { min: 2, max: 6 },
            protein: { min: 2.5, max: 4.5 },
            lactose: { min: 4, max: 5.5 },
            solids: { min: 8, max: 12 }
        }
    };

    if (this.totalQuantity < thresholds.low) {
        this.status = 'low';
    } else if (this.totalQuantity > thresholds.high) {
        this.status = 'high';
    } else if (this.averageQuality) {
        const { fat, protein, lactose, solids } = this.averageQuality;
        const abnormal = 
            (fat && (fat < thresholds.abnormal.fat.min || fat > thresholds.abnormal.fat.max)) ||
            (protein && (protein < thresholds.abnormal.protein.min || protein > thresholds.abnormal.protein.max)) ||
            (lactose && (lactose < thresholds.abnormal.lactose.min || lactose > thresholds.abnormal.lactose.max)) ||
            (solids && (solids < thresholds.abnormal.solids.min || solids > thresholds.abnormal.solids.max));

        this.status = abnormal ? 'abnormal' : 'normal';
    } else {
        this.status = 'normal';
    }

    return this.status;
};

// Pre-save middleware
milkProductionSchema.pre('save', function(next) {
    this.calculateTotalQuantity();
    this.calculateAverageQuality();
    this.updateStatus();
    this.updatedAt = new Date();
    next();
});

const MilkProduction = mongoose.model('MilkProduction', milkProductionSchema);

module.exports = MilkProduction; 