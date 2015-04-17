'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Experience Schema
 */
var ExperienceSchema = new Schema({
	profile: {
        type: Schema.ObjectId,
        ref: 'Profile'
    },
    type: {
        type: String,
        enum: ['position', 'education', 'course', 'publication'],
        required: 'Type of experience not specified'
    },
    // General information
    title: {
        type: String,
        trim: true
    },
    institution: {
        type: String,
        trim: true,
        required: 'Affiliated institution of the experience is required'
    },
    summary: {
        type: String,
        trim: true,
        default: ''
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    isCurrent: {
        type: Boolean
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
    },

    // For job position

    // For education
    major: {
        type: [String],
        trim: true,
        default: ['Undeclared']
    },
    gpa: {
        type: Number
    },

    // For courses
    courseNumber: {
        type: String,
        trim: true
    },

    // For publication
    authors: {
        type: [String],
        trim: true,
        default: []
    }
});

mongoose.model('Experience', ExperienceSchema);
