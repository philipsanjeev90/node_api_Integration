'use strict';

import mongoose from 'mongoose'
const TrainingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        default: 1
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        required: true,
        default: 1
    },
    long_description: {
        type: String
    },
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
TrainingSchema.virtual('registration', {
    ref: 'Registeration',
    localField: '_id',
    foreignField: 'training'
});

TrainingSchema.virtual('topic', {
    ref: 'Topic',
    localField: '_id',
    foreignField: 'training'
});

export default mongoose.model('Training', TrainingSchema);
