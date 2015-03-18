'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Post = mongoose.model('Post'),
	_ = require('lodash');

/**
 * Create a Post
 */
exports.create = function(req, res) {
	var post = new Post(req.body);
	post.user = req.user;

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
	var post = req.post ;

	post = _.extend(post , req.body);

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
	var post = req.post ;

	post.remove(function(err) {
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

/**
 * Post authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.post.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


//*** Old codes
///**
// * Create a Post
// */
//exports.create = function(req, res) {
//    // Init Variables
//    var post = new Post(req.body);
//
//    //Add to missing fields
//    post.provider = 'local';
//    post.owner = req.user._id;
//
//    post.save(function(err) {
//        if (err) {
//            return res.status(400).send({
//                message: errorHandler.getErrorMessage(err)
//            });
//        }
//        else {
//            // If successful, send back the postID
//            req.send(post.__id);
//        }
//    });
//};
//
///**
// * Show the current Post
// */
//exports.read = function(req, res) {
//    Post.findById(req.params.postID, function(err, post){
//        if(!err && post){
//            res.json(post);
//        }
//        else{
//            res.status(400).send({ message: 'Post not found'});
//        }
//    });
//};
//
///**
// * Update a Post
// */
//exports.update = function(req, res) {
//    Post.findById(req.params.postID, function(err, post){
//        if(!err && post){
//            post = _.extend(post, req.body);
//            post.updated = Date.now();
//
//            post.save(function(err){
//                if (err) {
//                    return res.status(400).send({
//                        message: errorHandler.getErrorMessage(err)
//                    });
//                } else {
//                    //Update successfully, send back the postID
//                    res.send(post.id);
//                }
//            });
//        }
//    });
//};
//
///**
// * Delete an Post
// */
//exports.delete = function(req, res) {
//    var message = null;
//    Post.findById(req.params.postID, function(err, post){
//        if(!err && post){
//            post.isActive = false;
//            post.updated = Date.now();
//
//            post.save(function(err){
//                if (err) {
//                    return res.status(400).send({
//                        message: errorHandler.getErrorMessage(err)
//                    });
//                } else {
//                    //Update successfully, send back {@code true}
//                    res.send(true);
//                }
//            });
//        }
//    });
//};
//
///**
// * List of Posts
// */
////Get the most recent posts (with @param limit)
//exports.getRecent = function(req, res) {
//    var list = Post.find({isActive: true}).sort({'created': -1}).limit(req.params.limit);
//    res.json(list);
//};
