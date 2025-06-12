const mongoose = require('mongoose');

const vetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    availability: [{
        day: {
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        }
    }],
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
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    services: [{
        name: String,
        description: String,
        price: Number
    }],
    rating: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    isAvailable: {
        type: Boolean,
        default: true
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
vetSchema.index({ email: 1 }, { unique: true });
vetSchema.index({ licenseNumber: 1 }, { unique: true });
vetSchema.index({ location: '2dsphere' });
vetSchema.index({ specialization: 1 });
vetSchema.index({ isAvailable: 1 });

// Methods
vetSchema.methods.calculateAverageRating = function() {
    if (this.reviews.length === 0) return 0;
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / this.reviews.length;
};

vetSchema.methods.isAvailableAt = function(date) {
    const day = date.toLocaleLowerCase().split(',')[0];
    const time = date.toLocaleTimeString('en-US', { hour12: false });
    
    const schedule = this.availability.find(a => a.day === day);
    if (!schedule) return false;

    return time >= schedule.startTime && time <= schedule.endTime;
};

vetSchema.methods.addReview = async function(userId, rating, comment) {
    this.reviews.push({
        userId,
        rating,
        comment
    });

    // Update average rating
    this.rating.average = this.calculateAverageRating();
    this.rating.count = this.reviews.length;

    await this.save();
};

// Pre-save middleware
vetSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Vet = mongoose.model('Vet', vetSchema);

module.exports = Vet; 