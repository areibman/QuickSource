'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);
/**
 * Post Schema
 */
var PostSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        trim: true,
        default: '',
        required: 'Title of the post is required'
    },
    abstract: {
        type: String,
        trim: true,
        default: '',
        required: 'Abstract of the post is required'
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
        type: [Schema.ObjectId],
        ref: 'User',
        default: []
    },
    interestedUsers: {
        type: [Schema.ObjectId],
        ref: 'User',
        default: []
    },
    comments: {
        type: [Schema.ObjectId],
        ref: 'Comment',
        default: []
    }
});

PostSchema.plugin(autoIncrement.plugin, 'Post');
mongoose.model('Post', PostSchema);
