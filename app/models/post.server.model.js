'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * Post Schema
 */
var PostSchema = new Schema({
    //Provider info
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerData: {},
    additionalProvidersData: {},

    //Basic info
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: 'Owner is required'
    },
    title: {
        type: String,
        trim: true,
        validate: [validateLocalStrategyProperty, 'Title of the post is required']
    },
    abstract: {
        type: String,
        trim: true,
        default: ''
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    categories: {
        type: [String],
        trim: true,
        default: []
    },
    location: {
        type: String,
        trim: true,
        validate: [validateLocalStrategyProperty, 'Location(zip code) of the post is required'],
        match: [/^\d{5}$/, 'Please fill in your zip code in the correct format']
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
    },

    // Additional
    participants: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    interestedUsers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment',
        default: []
    }

});

mongoose.model('Post', PostSchema);
