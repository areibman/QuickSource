'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');

var errorHandler = require('../controllers/errors.server.controller'),
    Post = mongoose.model('Post');


/**
 * Create a Post
 */
exports.create = function(req, res) {
    // Init Variables
    var post = new Post(req.body);

    //Add to missing fields
    post.provider = 'local';
    post.owner = req.user._id;

    post.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            // If successful, send back the postID
            req.send(post.__id);
        }
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
    Post.findById(req.params.postID, function(err, post){
        if(!err && post){
            post = _.extend(post, req.body);
            post.updated = Date.now();

            post.save(function(err){
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    //Update successfully, send back the postID
                    res.send(post.id);
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
                    //Update successfully, send back {@code true}
                    res.send(true);
                }
            });
        }
    });
};

/**
 * List of Posts
 */
//Get the most recent posts (with @param limit)
exports.getRecent = function(req, res) {
    var list = Post.find({isActive: true}).sort({'created': -1}).limit(req.params.limit);
    res.json(list);
};
