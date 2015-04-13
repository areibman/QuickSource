'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Profile = mongoose.model('Profile'),
    errorHandler = require('./errors.server.controller'),
    _ = require('lodash');

/**
 * Show the current Profile
 */
exports.read = function(req, res) {
    var optProfile = [
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
    var profile = req.user.profile;

    profile = _.extend(profile , req.body);
    profile.updated = Date.now();

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
