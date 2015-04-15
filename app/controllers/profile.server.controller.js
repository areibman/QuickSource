'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    User = mongoose.model('User'),
    Profile = mongoose.model('Profile'),
    errorHandler = require('./errors.server.controller');

/**
 * Show the current Profile
 */
exports.read = function(req, res) {
    var optProfile = [
        { path : 'user', model : 'User', select: 'displayName roles school zipCode isActive', match : { isActive : true }},
        { path : 'positions', model : 'Experience', select : 'title institution summary startDate endDate isCurrent updated created', match : { isActive : true }},
        { path : 'educations', model : 'Experience', select : 'title institution summary major gpa startDate endDate isCurrent updated created', match : { isActive : true }},
        { path : 'courses', model : 'Experience', select : 'title institution summary courseNumber startDate endDate isCurrent updated created', match : { isActive : true }},
        { path : 'publications', model : 'Experience', select : 'title institution summary authors startDate endDate isCurrent updated created', match : { isActive : true }}
    ];

    Profile.populate(req.profile, optProfile, function(err, profile){
        if(err) res.status(400).send({message: 'Cannot find user profile'});
        else    res.json(profile);
    });
};

/**
 * Update a Profile
 */
exports.update = function(req, res) {
    var user = req.user;
    Profile.findById(req.user.profile, function(err, profile){
        profile = _.extend(profile, req.body);
        user.updated = Date.now();

        profile.save(function(err1) {
            if (err1) {
                return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            } else {
                user.save(function(err2){
                    if(err2)    return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
                    else        res.jsonp(profile);
                });
            }
        });
    });
};

/**
 * Delete an Profile
 */
exports.setInactive = function(req, res) {
    var profile = req.profile;
    profile = _.extend(profile , { isActive : false, updated : Date.now() });

    profile.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(profile);
        }
    });
};

/**
 * Experience middleware
 */
exports.profileByID = function(req, res, next, id) {
    Profile.findById(id).exec(function(err, profile) {
        if (err) return next(err);
        if (!profile) return next(new Error('Failed to load Experience ' + id));
        req.profile = profile;
        next();
    });
};

/**
 * Profile authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    Profile.findById(req.user.profile, function(err, profile){
        if(err) return res.status(400).send('User profile not found.');
        if(profile.user != req.user.id) return res.status(403).send('User is not authorized');
        next();
    });
};
