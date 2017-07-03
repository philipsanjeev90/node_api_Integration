'use strict';

import mongoose from 'mongoose'

const MessageSchema = mongoose.Schema({
    from: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    registration: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Registration'
    },
    text: {
        type: String,
        default: ''
    },
    read: Boolean,
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

export default mongoose.model('Message', MessageSchema);
