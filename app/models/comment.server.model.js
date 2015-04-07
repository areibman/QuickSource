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
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    content: {
		type: String,
		required: 'Please fill in comment content',
		trim: true
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
