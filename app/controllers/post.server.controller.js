'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');

var errorHandler = require('errors.server.controller'),
    Post = mongoose.model('Post');


/**
 * Create a Post
 */
exports.create = function(req, res) {
    // Init Variables
    var post = new Post(req.body);
    var message = null;

    //Add to missing fields
    post.provider = 'local';
    post.owner = req.user;

    post.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        //else {
        //    // If successful, do something
        //}
    });
};

/**
 * Show the current Post
 */
exports.read = function(req, res) {

};

/**
 * Update a Post
 */
exports.update = function(req, res) {

};

/**
 * Delete an Post
 */
exports.delete = function(req, res) {

};

/**
 * List of Posts
 */
exports.list = function(req, res) {

};
