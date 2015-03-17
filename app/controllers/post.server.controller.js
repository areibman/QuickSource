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
    Post.findById(req.params.postID, function(err, post){
        if(!err && post){
            res.json(post);
        }
        else{
            res.status(400).send({ message: 'Post not found'});
        }
    });
};

/**
 * Update a Post
 */
exports.update = function(req, res) {
    var message = null;
    Post.findById(req.params.postID, function(err, post){
        if(!err && post){
            post = _.extend(user, req.body);
            post.updated = Date.now();

            post.save(function(err){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    //Update successfully, do something
                }
            });
        }
    });
};

/**
 * Delete an Post
 */
exports.delete = function(req, res) {
    var message = null;
    Post.findById(req.params.postID, function(err, post){
        if(!err && post){
            post.isActive = false;
            post.updated = Date.now();

            post.save(function(err){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    //Update successfully, do something
                }
            });
        }
    });
};

/**
 * List of Posts
 */
exports.getRecent = function(req, res) {
    var list = Post.find({isActive: true}).sort({'created': -1}).limit(req.params.limit);
    res.json(list);
};
