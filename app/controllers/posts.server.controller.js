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
            res.jsonp(post);
        }
    });
};

/**
 * Show the current Post
 */
exports.read = function(req, res) {
    Post.findById(req.params.postId, function(err, post){
        if(err && !post){ return res.status(400).send({ message: 'Post not found'}); }
        if(!post.isActive){ return res.status(400).send({ message: 'Post Inactive'}); }
        else{
            var opt = [
                { path : 'user', model : 'User', select: 'displayName roles school zipCode isActive', match : { isActive : true }},
                { path : 'interestedUsers', model : 'User', select: 'displayName roles school zipCode isActive', match : { isActive : true }},
                { path : 'participants', model : 'User', select: 'displayName roles school zipCode isActive', match : { isActive : true }},
                { path : 'comments', model : 'Comment',  match : { isActive : true }}
            ];

            Post.populate(post, opt, function(err, post) {
                if (err || !post.user.isActive) {
                    res.status(400).send({message: 'Post user not found'});
                }
                else {
                    console.log(post);
                    res.jsonp(post);
                }
            });
        }
    });
};

/**
 * Update a Post
 */
exports.update = function(req, res) {
	var post = req.post;

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
exports.setInactive = function(req, res) {
	var post = req.post;
    post = _.extend(post , { isActive : false, updated : Date.now() });

    console.log(post);
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
 * List of Posts
 */
exports.list = function(req, res) { 
	Post.find().sort('-created').populate('user', 'displayName school location').exec(function(err, posts) {
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
    var post = req.post;

    if(post.interestedUsers.indexOf(req.user.id) < 0){
        post.interestedUsers.push(req.user);
        post.updated = Date.now();

        console.log(post);

        post.save(function(err) {
            if (err) {
                console.log(err);
                return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            } else {
                res.jsonp(post);
            }
        });
    }
};
