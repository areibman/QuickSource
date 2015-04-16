'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
    Profile = mongoose.model('Profile'),
    Experience = mongoose.model('Experience');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.json(req.user || null);
};

exports.profile = function(req, res) {
    if(req.user){
        var optUser = [
            { path : 'profile', model : 'Profile', match : { isActive : true }},
            { path : 'notifications', model : 'Notification', select : 'title message created viewed', match : { isActive : true }}
        ];
        User.populate(req.user, optUser, function(err, user){
            if(err) res.status(400).send({message: 'Cannot find user profile'});
            else{
                var optProfile = [
                    { path : 'profile.positions', model : 'Experience', select : 'title institution summary startDate endDate isCurrent updated created', match : { isActive : true }},
                    { path : 'profile.educations', model : 'Experience', select : 'title institution summary major gpa startDate endDate isCurrent updated created', match : { isActive : true }},
                    { path : 'profile.courses', model : 'Experience', select : 'title institution summary courseNumber startDate endDate isCurrent updated created', match : { isActive : true }},
                    { path : 'profile.publications', model : 'Experience', select : 'title institution summary authors startDate endDate isCurrent updated created', match : { isActive : true }}
                ];

                Profile.populate(user, optProfile, function(err, populatedProfile){
                    if(err) res.status(400).send({message: 'Cannot find user profile'});
                    else    res.json(populatedProfile);
                });
            }
        });
    }
    else    res.json(null);
};

exports.getNotifications = function(req, res) {
    if(req.user){
        var opt = [
            { path : 'notifications', model : 'Notification', select : 'title message created viewed', match : { isActive : true }}
        ];
        User.populate(req.user, opt, function(err, user) {
            if (err) res.status(400).send({message: 'Cannot find user profile'});
            res.json(user.notifications);
        });
    }
    else    res.json(null);
};

/**
 * Email validation
 */
exports.validateEmail = function(req, res){
    var user = req.user;
    user.emailValidated = true;
    user.save(function(err){
        if(err) res.status(400).send({message: 'User email cannot be validated.'});
        else res.json(user);
    });

};
