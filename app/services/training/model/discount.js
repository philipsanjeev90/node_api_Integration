'use strict';

import mongoose from 'mongoose'

const DiscountMakerSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    message: {
        type: String,
        default: ''
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
}, );
export default mongoose.model('DiscountMaker', DiscountMakerSchema);
