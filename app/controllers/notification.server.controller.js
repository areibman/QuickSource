'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Notification = mongoose.model('Notification'),
    emailHandler = require('./emailhandler.server.controller'),
    errorHandler = require('./errors.server.controller'),
    _ = require('lodash');

    /*
        Sample notification object
        var notificationOpt = {
            recipient: userId,
            title: 'Title',
            message: 'Message,
        }
     */

/**
 * Send Notification (from route)
 */
exports.sendNotification_route = function(req, res) {
    var user;
    var notification = new Notification(req.body);

    if(req.user)        user = req.user;
    //console.log(req.body);
    notification.recipient = user;
    notification.save(function(errN){
        if(errN) return res.status(400).send({ message: errorHandler.getErrorMessage(errN) });
        user.notifications.push(notification);
            if(user.enableEmailNotification)
                emailHandler.sendEmail({
                    from: 'QuickSource <emory.quicksource@gmail.com>',
                    to: user.email,
                    subject: notification.title,
                    text: notification.message,
                    html: '<b>' + notification.message + '</b>'
                });
        user.save();
        });
};
/**
 * Send Notification (Internal)
 */
exports.sendNotification = function(user, notificationOpt) {
    var notification = new Notification(notificationOpt);
    notification.save(function(errN){
        user.notifications.push(notification);
        if(user.enableEmailNotification)
            emailHandler.sendEmail({
                from: 'QuickSource <emory.quicksource@gmail.com>',
                to: user.email,
                subject: notification.title,
                text: notification.message,
                html: '<b>' + notification.message + '</b>'
            });
        user.save();
    });
};

/**
 * Show the current Notification
 */
exports.read = function(req, res) {
    res.json(req.notification);
};

/**
 * Set Read a Notification
 */
exports.setRead = function(req, res) {
    var notification = req.notification;
    notification = _.extend(notification , { viewed : true });

    notification.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else res.jsonp(notification);
    });
};

/**
 * Set Inactive a Notification
 */
exports.setInactive = function(req, res) {
    var notification = req.notification;
    notification = _.extend(notification , { isActive : false });

    notification.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else res.jsonp(notification);
    });
};

/**
 * Notification middleware
 */
exports.notificationByID = function(req, res, next, id) {
    Notification.findById(id).exec(function(err, notification) {
        if (err) return next(err);
        if (! notification) return next(new Error('Failed to load Post ' + id));
        req.notification = notification ;
        next();
    });
};

/**
 * Notification authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.notification.recipient.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
