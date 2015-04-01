'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    filehandler = require('fileupload').createFileUpload('../../../uploads/profilePic').middleware,
    _ = require('lodash');

/**
 * Get User Profile Picture
 */
exports.getProfilePic = function(req, res){
    filehandler.get('default.png', function(error, data){
       if(error) res.jsonp(error);
        res.jsonp(data);
    });
};

/**
 * Upload User Profile Picture
 */
exports.uploadProfilePic = function(req, res){
    console.log('Testing...');
};
