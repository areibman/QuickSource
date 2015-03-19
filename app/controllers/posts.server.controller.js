'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	User = mongoose.model('User'),
    Post = mongoose.model('Post'),
	_ = require('lodash');

/**
 * Create a Post
 */
exports.create = function(req, res) {
    var post = new Post(req.body);
    post.user = req.user;
    post.updated = Date.now();
    var message = null;

    post.save(function(err) {
        if (err) {
            return res.status(400).send({
            	message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.send(String(post._id));
        }
    });
};

/**
 * Show the current Post
 */
exports.read = function(req, res) {
    Post.findById(req.params.postId, function(err, post){
        if(!err && post){
            User.findOne({_id : post.user}).select('displayName roles school isActive').exec(function(err, user){
                if(err || !user.isActive){
                   res.status(400).send({ message: 'Post user not found'});
               }
               else{
                    var postObject =
                    {
                        _id: post._id,
                        __v: post.__v,
                        title: post.title,
                        abstract: post.abstract,
                        description: post.description,
                        location: post.location,
                        created: post.created,
                        updated: post.updated,
                        isActive: post.isActive
                    };

                    //user
                    User.findById(post.user).select('_id displayName roles school isActive').exec(function (err, owner) {
                        postObject.user = owner;
                        if (err) res.status(400).send({ message: 'Owner user not found'});
                        //Interested Users
                        User.find({
                            '_id': {$in: post.interestedUsers},
                            'isActive': true
                        }).select('_id displayName roles school isActive').exec(function (err, interestedUsers) {
                            postObject.interestedUsers = interestedUsers;
                            if (err) res.status(400).send({ message: 'Owner user not found'});
                            //Participants
                            User.find({
                                '_id': {$in: post.participants},
                                'isActive': true
                            }).select('_id displayName roles school isActive').exec(function (err, participants) {
                                postObject.participants = participants;
                                if (err) res.status(400).send({ message: 'Owner user not found'});
                                res.jsonp(postObject);
                            });
                        });
                    });
               }
            });
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
	var post = req.post ;

	post = _.extend(post , req.body);
    post.updated = Date.now();

	post.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(post);
		}
	});
};

/**
 * Delete an Post
 */
exports.delete = function(req, res) {
	var post = req.post;

    post.isActive = false;

	post.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			req.send(Boolean(true));
		}
	});
};

/**
 * List of Posts
 */
exports.list = function(req, res) { 
	Post.find().sort('-created').populate('user', 'displayName').exec(function(err, posts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(posts);
		}
	});
};

/**
 * Post middleware
 */
exports.postByID = function(req, res, next, id) { 
	Post.findById(id).populate('user', 'displayName').exec(function(err, post) {
		if (err) return next(err);
		if (! post) return next(new Error('Failed to load Post ' + id));
		req.post = post ;
		next();
	});
};

exports.listLimit = function(req, res, next, limit) {
    if(!isNaN(limit)){
        req.limit = limit;
    }
    else{
        req.limit = 20;
    }
    next();
};

/**
 * Post authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.post.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

/**
 * Add interest user to a post
 */
exports.addInterest = function(req, res){
    Post.findOne(req.body.post, function(err, post){
        if(err){
            res.status(400).send('Post not found');
        }
        else{
            if(post.interestedUsers.indexOf(req.user._id) < 0){
                post.interestedUsers.push(req.user._id);
                post.updated = Date.now();
                post.save(function(err) {
                    if (err) {
                        return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                    } else {
                        res.jsonp(post);
                    }
                });
            }
        }
    });
};
