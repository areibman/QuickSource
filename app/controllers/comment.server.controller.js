'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');

var errorHandler = require('../controllers/errors.server.controller'),
    Comment = mongoose.model('Comment');

/**
 * Create a Comment
 */
exports.create = function(req, res) {
    var comment = new Comment(req.body);

    //Add to missing fields
    comment.provider = 'local';
    comment.owner = req.user._id;

    comment.save(function(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            // If successful, send back the postID
            req.send(comment._id);
        }
    });
};

/**
 * Show the current Comment
 */
exports.read = function(req, res) {

};

/**
 * Update a Comment
 */
exports.update = function(req, res) {

};

/**
 * Delete an Comment
 */
exports.delete = function(req, res) {

};

/**
 * List of Comments
 */
exports.list = function(req, res) {

};
