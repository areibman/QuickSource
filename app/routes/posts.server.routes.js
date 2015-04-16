'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var posts = require('../../app/controllers/posts.server.controller');
    var comments = require('../../app/controllers/comments.server.controller');

	// Posts Routes
	app.route('/posts')
        .get(posts.list)
		.post(users.requiresLogin, posts.create);

	app.route('/posts/:postId')
		.get(posts.read)
		.put(users.requiresLogin, posts.hasAuthorization, posts.update);

    app.route('/posts/:postId/opt-in')
        .post(users.requiresLogin, posts.addInterest);
    app.route('/posts/:postId/opt-out')
        .post(users.requiresLogin, posts.removeInterest);

    app.route('/posts/:postId/remove')
        .put(users.requiresLogin, posts.hasAuthorization, posts.setInactive);

    app.route('/posts/:postId/addComment')
        .post(users.requiresLogin, posts.addComment);
    app.route('/posts/:postId/listComments')
        .get(posts.listComments);
    app.route('/posts/:postId/removeComment/:commentId')
        .put(users.requiresLogin, posts.removeComment);

	// Finish by binding the Post middleware
	app.param('postId', posts.postByID);
    app.param('commentId', comments.commentByID);
};
