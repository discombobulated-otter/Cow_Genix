const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    notes: String,
    administeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vet'
    }
});

const healthRecordSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    diagnosis: String,
    treatment: String,
    notes: String,
    vetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vet'
    }
});

const breedingRecordSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'successful', 'failed'],
        required: true
    },
    bullId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cow'
    },
    notes: String
});

const milkProductionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    quality: {
        type: String,
        enum: ['excellent', 'good', 'average', 'poor'],
        default: 'good'
    },
    notes: String
});

const cowSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'sold', 'deceased'],
        default: 'active'
    },
    weight: {
        current: Number,
        history: [{
            date: Date,
            weight: Number
        }]
    },
    height: Number,
    color: String,
    identification: {
        tagNumber: String,
        microchipId: String,
        otherIds: [String]
    },
    parentage: {
        mother: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cow'
        },
        father: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cow'
        }
    },
    vaccinations: [vaccinationSchema],
    healthRecords: [healthRecordSchema],
    breedingRecords: [breedingRecordSchema],
    milkProduction: [milkProductionSchema],
    diet: {
        current: {
            type: String,
            default: 'standard'
        },
        history: [{
            date: Date,
            diet: String,
            notes: String
        }]
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    notes: String,
    images: [String],
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
cowSchema.index({ userId: 1 });
cowSchema.index({ name: 1 });
cowSchema.index({ breed: 1 });
cowSchema.index({ status: 1 });
cowSchema.index({ location: '2dsphere' });

// Methods
cowSchema.methods.calculateAge = function() {
    const now = new Date();
    const birthDate = new Date(this.birthDate);
    const ageInMilliseconds = now - birthDate;
    const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
    return Math.floor(ageInYears);
};

cowSchema.methods.getLastVaccination = function() {
    if (this.vaccinations.length === 0) return null;
    return this.vaccinations[this.vaccinations.length - 1];
};

cowSchema.methods.getLastHealthRecord = function() {
    if (this.healthRecords.length === 0) return null;
    return this.healthRecords[this.healthRecords.length - 1];
};

cowSchema.methods.getAverageMilkProduction = function(days = 30) {
    const now = new Date();
    const startDate = new Date(now - days * 24 * 60 * 60 * 1000);
    
    const recentProduction = this.milkProduction.filter(record => 
        new Date(record.date) >= startDate
    );

    if (recentProduction.length === 0) return 0;

    const total = recentProduction.reduce((sum, record) => sum + record.quantity, 0);
    return total / recentProduction.length;
};

// Pre-save middleware
cowSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Cow = mongoose.model('Cow', cowSchema);

module.exports = Cow; 