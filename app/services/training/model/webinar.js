'use strict';
import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs';
const WebinarSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 1
    },
    type: {
        type: String
    },
    register_time: {
        type: Number,
        required: true,
        default: 1
    },
    register_type: {
        type: Number,
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
export default mongoose.model('Webinar', WebinarSchema);
