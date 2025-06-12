const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    businessHours: [{
        day: {
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            required: true
        },
        open: {
            type: String,
            required: true
        },
        close: {
            type: String,
            required: true
        },
        isClosed: {
            type: Boolean,
            default: false
        }
    }],
    categories: [{
        type: String,
        required: true
    }],
    products: [{
        name: {
            type: String,
            required: true
        },
        description: String,
        price: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            default: 0
        },
        images: [String],
        isAvailable: {
            type: Boolean,
            default: true
        }
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
    isOpen: {
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
shopSchema.index({ email: 1 }, { unique: true });
shopSchema.index({ location: '2dsphere' });
shopSchema.index({ categories: 1 });
shopSchema.index({ isOpen: 1 });
shopSchema.index({ 'products.category': 1 });

// Methods
shopSchema.methods.calculateAverageRating = function() {
    if (this.reviews.length === 0) return 0;
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / this.reviews.length;
};

shopSchema.methods.isOpenAt = function(date) {
    const day = date.toLocaleLowerCase().split(',')[0];
    const time = date.toLocaleTimeString('en-US', { hour12: false });
    
    const schedule = this.businessHours.find(h => h.day === day);
    if (!schedule || schedule.isClosed) return false;

    return time >= schedule.open && time <= schedule.close;
};

shopSchema.methods.addReview = async function(userId, rating, comment) {
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

shopSchema.methods.addProduct = async function(product) {
    this.products.push(product);
    await this.save();
};

shopSchema.methods.updateProduct = async function(productId, updates) {
    const product = this.products.id(productId);
    if (!product) throw new Error('Product not found');
    
    Object.assign(product, updates);
    await this.save();
};

shopSchema.methods.removeProduct = async function(productId) {
    this.products.pull(productId);
    await this.save();
};

// Pre-save middleware
shopSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop; 