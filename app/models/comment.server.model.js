'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

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
		default: '',
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

CommentSchema.plugin(autoIncrement.plugin, 'Comment');
mongoose.model('Comment', CommentSchema);
