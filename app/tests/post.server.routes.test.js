'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Post = mongoose.model('Post'),
	agent = request.agent(app);

/**
* Globals
*/
var credentials, user, post;

/**
* Post routes tests
*/
describe('Post CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local',
            zipCode: '12345'
		});

		// Save a user to the test db and create new Post
		user.save(function() {
            post = new Post({
                title: 'Post Name',
                abstract: 'Abstract',
                location: '12345',
                user: user
            });

			done();
		});
	});

	it('should be able to save Post instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Post
				agent.post('/posts')
					.send(post)
					.expect(200)
					.end(function(postSaveErr, postSaveRes) {
						// Handle Post save error
						if (postSaveErr) done(postSaveErr);

						// Get a list of Posts
						agent.get('/posts')
							.end(function(postsGetErr, postsGetRes) {
								// Handle Post save error
								if (postsGetErr) done(postsGetErr);

								// Get Posts list
								var posts = postsGetRes.body;

								// Set assertions
								(posts[0].user._id).should.equal(userId);
								(posts[0].title).should.match('Post Name');
                                (posts[0].abstract).should.match('Abstract');
                                (posts[0].location).should.match('12345');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Post instance if not logged in', function(done) {
		agent.post('/posts')
			.send(post)
			.expect(401)
			.end(function(postSaveErr, postSaveRes) {
				// Call the assertion callback
				done(postSaveErr);
			});
	});

	it('should not be able to save Post instance if no name is provided', function(done) {
		// Invalidate name field
		post.title = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Post
				agent.post('/posts')
					.send(post)
					.expect(400)
					.end(function(postSaveErr, postSaveRes) {
						// Set message assertion
						(postSaveRes.body.message).should.match('Title of the post is required');

						// Handle Post save error
						done(postSaveErr);
					});
			});
	});

	it('should be able to update Post instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Post
				agent.post('/posts')
					.send(post)
					.expect(200)
					.end(function(postSaveErr, postSaveRes) {
						// Handle Post save error
						if (postSaveErr) done(postSaveErr);

						// Update Post name
						post.title = 'WHY YOU GOTTA BE SO MEAN?';
                        post.abstract = 'NEW ABSTRACT';
                        post.location = '11111';

						// Update existing Post
						agent.put('/posts/' + postSaveRes.body._id)
							.send(post)
							.expect(200)
							.end(function(postUpdateErr, postUpdateRes) {
								// Handle Post update error
								if (postUpdateErr) done(postUpdateErr);

								// Set assertions
								(postUpdateRes.body._id).should.equal(postSaveRes.body._id);
								(postUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');
                                (postUpdateRes.body.abstract).should.match('NEW ABSTRACT');
                                (postUpdateRes.body.location).should.match('11111');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Posts if not signed in', function(done) {
		// Create new Post model instance
		var postObj = new Post(post);

		// Save the Post
		postObj.save(function() {
			// Request Posts
			request(app).get('/posts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Post if not signed in', function(done) {
		// Create new Post model instance
		var postObj = new Post(post);

		// Save the Post
		postObj.save(function() {
			request(app).get('/posts/' + postObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', post.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Post instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Post
				agent.post('/posts')
					.send(post)
					.expect(200)
					.end(function(postSaveErr, postSaveRes) {
						// Handle Post save error
						if (postSaveErr) done(postSaveErr);

						// Delete existing Post
						agent.put('/posts/' + postSaveRes.body._id + '/remove')
							.send(post)
							.expect(200)
							.end(function(postDeleteErr, postDeleteRes) {
								// Handle Post error error
								if (postDeleteErr) done(postDeleteErr);

								// Set assertions
								(postDeleteRes.body._id).should.equal(postSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Post instance if not signed in', function(done) {
		// Set Post user
		post.user = user;

		// Create new Post model instance
		var postObj = new Post(post);

		// Save the Post
		postObj.save(function() {
			// Try deleting Post
			request(app).put('/posts/' + postObj._id + '/remove')
			.expect(401)
			.end(function(postDeleteErr, postDeleteRes) {
				// Set message assertion
				(postDeleteRes.body.message).should.match('User is not logged in');

				// Handle Post error error
				done(postDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Post.remove().exec();
		done();
	});
});
