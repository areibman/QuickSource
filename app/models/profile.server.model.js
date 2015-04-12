'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Profile Schema
 */
var ProfileSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    headline: {
        type: String,
        trim: true,
        default: ''
    },
    positions: {
        type: [Schema.ObjectId],
        ref: 'Experience',
        default: []
    },
    educations: {
        type: [Schema.ObjectId],
        ref: 'Experience',
        default: []
    },
    courses: {
        type: [Schema.ObjectId],
        ref: 'Experience',
        default: []
    },
    publications: {
        type: [Schema.ObjectId],
        ref: 'Experience',
        default: []
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

mongoose.model('Profile', ProfileSchema);
