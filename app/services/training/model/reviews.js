'use strict';

import mongoose from 'mongoose'
const ReviewSchema = mongoose.Schema({
    trainer: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
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
    registration: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Registration'
    },
    text: {
        type: String,
        required: true
    },
    rating: {
        type: String,
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
export default mongoose.model('Review', ReviewSchema);
