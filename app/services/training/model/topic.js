'use strict';
import mongoose from 'mongoose'
const TopicSchema = mongoose.Schema({
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
    topic_name: {
        type: String
    },
    topic_description: {
        type: String
    },
    topic_list: {
        meta: mongoose.Schema.Types.Mixed
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

export default mongoose.model('Topic', TopicSchema);
