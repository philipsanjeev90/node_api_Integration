'use strict';
import mongoose from 'mongoose'
const PaymentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    training: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    registration: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    transaction_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 1
    },
    currency: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1
    },
    date: {
        createdAt: {
            type: Date,
            required: true
        },
        updatedAt: {
            type: Date,
            required: true
        }
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});



export default mongoose.model('Payment', PaymentSchema);
