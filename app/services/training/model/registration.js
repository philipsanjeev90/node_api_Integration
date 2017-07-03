'use strict';
import mongoose from 'mongoose'
const RegistrationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    training: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Training'
    },
    payment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Payment'
    },
    total_developers: {
        type: Number,
        required: true,
        default: 1
    },
    developers: [mongoose.Schema.Types.Mixed],
    amount: {
        type: Number,
        required: true,
        default: 1
    },
    payment_method: {
        type: Number,
        required: true
    },
    meta: mongoose.Schema.Types.Mixed,
    status: {
        type: Number,
        default: 1
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
RegistrationSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'registration'
});
export default mongoose.model('Registration', RegistrationSchema);
