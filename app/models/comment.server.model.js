'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
    //Provider info
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerData: {},
    additionalProvidersData: {},

    //Basic info
    _id: Number,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: 'Owner is required'
    },
    content: {
        type: String,
        trim: true,
        required: 'Content of the comment is required'
    },
        updated:{
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

mongoose.model('Comment', CommentSchema);
