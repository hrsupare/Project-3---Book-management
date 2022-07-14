const mongoose = require('mongoose')
const moment = require('moment')

const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true,
    },
    excerpt: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    ISBN: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: [String],
        required: true
    },
    reviews: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
    
        required: true,
    },
    deletedAt: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model('book', bookSchema);