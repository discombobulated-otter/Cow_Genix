const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'vet', 'shop_owner'],
        default: 'user'
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
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
    profileImage: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    preferences: {
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            },
            sms: {
                type: Boolean,
                default: false
            }
        },
        language: {
            type: String,
            default: 'en'
        },
        theme: {
            type: String,
            default: 'light'
        }
    },
    favorites: {
        vets: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vet'
        }],
        shops: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shop'
        }]
    },
    notifications: [{
        type: {
            type: String,
            enum: ['system', 'alert', 'reminder', 'update'],
            required: true
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    lastLogin: {
        type: Date,
        default: Date.now
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
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ location: '2dsphere' });
userSchema.index({ 'notifications.isRead': 1 });

// Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.addNotification = async function(type, title, message) {
    this.notifications.push({
        type,
        title,
        message
    });
    await this.save();
};

userSchema.methods.markNotificationAsRead = async function(notificationId) {
    const notification = this.notifications.id(notificationId);
    if (notification) {
        notification.isRead = true;
        await this.save();
    }
};

userSchema.methods.addToFavorites = async function(type, id) {
    if (type === 'vet') {
        if (!this.favorites.vets.includes(id)) {
            this.favorites.vets.push(id);
        }
    } else if (type === 'shop') {
        if (!this.favorites.shops.includes(id)) {
            this.favorites.shops.push(id);
        }
    }
    await this.save();
};

userSchema.methods.removeFromFavorites = async function(type, id) {
    if (type === 'vet') {
        this.favorites.vets = this.favorites.vets.filter(vetId => vetId.toString() !== id.toString());
    } else if (type === 'shop') {
        this.favorites.shops = this.favorites.shops.filter(shopId => shopId.toString() !== id.toString());
    }
    await this.save();
};

// Pre-save middleware
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    this.updatedAt = new Date();
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User; 