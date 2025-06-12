const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
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
    type: {
        type: String,
        enum: ['checkup', 'treatment', 'vaccination', 'injury', 'disease', 'other'],
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    symptoms: [{
        type: String
    }],
    treatment: {
        medications: [{
            name: String,
            dosage: String,
            frequency: String,
            duration: String,
            notes: String
        }],
        procedures: [{
            name: String,
            description: String,
            date: Date,
            performedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }],
        recommendations: [String]
    },
    vitals: {
        temperature: {
            type: Number,
            min: 0
        },
        heartRate: {
            type: Number,
            min: 0
        },
        respiratoryRate: {
            type: Number,
            min: 0
        },
        weight: {
            type: Number,
            min: 0
        }
    },
    status: {
        type: String,
        enum: ['active', 'resolved', 'chronic', 'monitoring'],
        default: 'active'
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'low'
    },
    followUp: {
        required: {
            type: Boolean,
            default: false
        },
        date: Date,
        notes: String
    },
    cost: {
        amount: {
            type: Number,
            min: 0
        },
        currency: {
            type: String,
            default: 'USD'
        },
        details: String
    },
    attachments: [{
        type: String, // URLs to files/images
        description: String
    }],
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
healthRecordSchema.index({ cowId: 1, date: 1 });
healthRecordSchema.index({ type: 1 });
healthRecordSchema.index({ status: 1 });
healthRecordSchema.index({ severity: 1 });

// Methods
healthRecordSchema.methods.updateStatus = function() {
    if (this.followUp.required && this.followUp.date > new Date()) {
        this.status = 'monitoring';
    } else if (this.status === 'active' && !this.followUp.required) {
        this.status = 'resolved';
    }
    return this.status;
};

healthRecordSchema.methods.calculateSeverity = function() {
    const severityFactors = {
        critical: {
            temperature: { min: 41, max: 35 },
            heartRate: { min: 100, max: 40 },
            respiratoryRate: { min: 40, max: 10 }
        },
        high: {
            temperature: { min: 40, max: 36 },
            heartRate: { min: 90, max: 50 },
            respiratoryRate: { min: 30, max: 15 }
        },
        medium: {
            temperature: { min: 39, max: 37 },
            heartRate: { min: 80, max: 60 },
            respiratoryRate: { min: 25, max: 20 }
        }
    };

    const { temperature, heartRate, respiratoryRate } = this.vitals;
    let severity = 'low';

    if (temperature || heartRate || respiratoryRate) {
        for (const [level, thresholds] of Object.entries(severityFactors)) {
            const isCritical = 
                (temperature && (temperature >= thresholds.temperature.min || temperature <= thresholds.temperature.max)) ||
                (heartRate && (heartRate >= thresholds.heartRate.min || heartRate <= thresholds.heartRate.max)) ||
                (respiratoryRate && (respiratoryRate >= thresholds.respiratoryRate.min || respiratoryRate <= thresholds.respiratoryRate.max));

            if (isCritical) {
                severity = level;
                break;
            }
        }
    }

    this.severity = severity;
    return severity;
};

healthRecordSchema.methods.addMedication = function(medication) {
    this.treatment.medications.push(medication);
    return this.save();
};

healthRecordSchema.methods.addProcedure = function(procedure) {
    this.treatment.procedures.push(procedure);
    return this.save();
};

// Pre-save middleware
healthRecordSchema.pre('save', function(next) {
    this.updateStatus();
    this.calculateSeverity();
    this.updatedAt = new Date();
    next();
});

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

module.exports = HealthRecord; 