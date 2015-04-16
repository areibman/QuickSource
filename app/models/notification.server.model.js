'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Notification Schema
 */
var NotificationSchema = new Schema({
	recipient: {
        type: Schema.ObjectId,
        ref: 'User',
        required: 'Recipient of the notification is required'
    },
    title: {
        type: String,
        trim: true,
        default: ''
    },
    message: {
        type: String,
        trim: true,
        required: 'Message of the notification is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    viewed: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

mongoose.model('Notification', NotificationSchema);
