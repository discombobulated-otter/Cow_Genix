const mongoose = require('mongoose');

const breedingSchema = new mongoose.Schema({
    cowId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cow',
        required: true
    },
    bullId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cow'
    },
    method: {
        type: String,
        enum: ['natural', 'artificial', 'embryo_transfer'],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['planned', 'completed', 'successful', 'failed', 'cancelled'],
        default: 'planned'
    },
    pregnancy: {
        confirmed: {
            type: Boolean,
            default: false
        },
        confirmationDate: Date,
        expectedDeliveryDate: Date,
        actualDeliveryDate: Date,
        notes: String
    },
    offspring: [{
        cowId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cow'
        },
        gender: {
            type: String,
            enum: ['male', 'female']
        },
        birthWeight: Number,
        notes: String
    }],
    healthChecks: [{
        date: Date,
        status: {
            type: String,
            enum: ['normal', 'concern', 'critical']
        },
        notes: String,
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    costs: {
        total: {
            type: Number,
            min: 0
        },
        currency: {
            type: String,
            default: 'USD'
        },
        breakdown: [{
            category: String,
            amount: Number,
            date: Date,
            notes: String
        }]
    },
    documents: [{
        type: {
            type: String,
            enum: ['certificate', 'report', 'image', 'other']
        },
        url: String,
        description: String,
        date: Date
    }],
    notes: String,
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
breedingSchema.index({ cowId: 1, date: 1 });
breedingSchema.index({ status: 1 });
breedingSchema.index({ 'pregnancy.confirmed': 1 });
breedingSchema.index({ 'pregnancy.expectedDeliveryDate': 1 });

// Methods
breedingSchema.methods.updateStatus = function() {
    if (this.status === 'completed' && this.pregnancy.confirmed) {
        this.status = 'successful';
    } else if (this.status === 'completed' && !this.pregnancy.confirmed) {
        this.status = 'failed';
    }
    return this.status;
};

breedingSchema.methods.calculateExpectedDeliveryDate = function() {
    if (this.pregnancy.confirmed && this.date) {
        // Average gestation period for cows is 283 days
        const gestationPeriod = 283;
        const deliveryDate = new Date(this.date);
        deliveryDate.setDate(deliveryDate.getDate() + gestationPeriod);
        this.pregnancy.expectedDeliveryDate = deliveryDate;
    }
    return this.pregnancy.expectedDeliveryDate;
};

breedingSchema.methods.addHealthCheck = function(healthCheck) {
    this.healthChecks.push(healthCheck);
    return this.save();
};

breedingSchema.methods.addCost = function(cost) {
    this.costs.breakdown.push(cost);
    this.costs.total = this.costs.breakdown.reduce((sum, cost) => sum + cost.amount, 0);
    return this.save();
};

breedingSchema.methods.addDocument = function(document) {
    this.documents.push(document);
    return this.save();
};

// Pre-save middleware
breedingSchema.pre('save', function(next) {
    this.updateStatus();
    this.calculateExpectedDeliveryDate();
    this.updatedAt = new Date();
    next();
});

const Breeding = mongoose.model('Breeding', breedingSchema);

module.exports = Breeding; 