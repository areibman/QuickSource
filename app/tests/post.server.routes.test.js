'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Post = mongoose.model('Post'),
    Comment = mongoose.model('Comment'),
	agent = request.agent(app);

/**
* Globals
*/
var credentials_user, credentials_vistor, user, vistor, post, comment;

/**
* Post routes tests
*/
describe('Post CRUD tests', function() {
    beforeEach(function(done) {
		// Create user credentials_user
		credentials_user = {
			username: 'username',
			password: 'password'
		};

        credentials_vistor = {
            username: 'username_vistor',
            password: 'password_vistor'
        };

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.edu',
			username: credentials_user.username,
			password: credentials_user.password,
			provider: 'local',
            zipCode: '12345'
		});

        vistor = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.edu',
            username: credentials_vistor.username,
            password: credentials_vistor.password,
            provider: 'local',
            zipCode: '12345'
        });

        comment = new Comment({
            user: user,
            content: 'Comment content'
        });

		// Save a user to the test db and create new Post
		user.save(function() {
            post = new Post({
                title: 'Post Name',
                abstract: 'Abstract',
                location: '12345',
                user: user
            });
		});

        vistor.save(function() {
            done();
        });
    });

	it('should be able to save Post instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials_user)
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
			.send(credentials_user)
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
			.send(credentials_user)
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
			.send(credentials_user)
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

    it('should be able to opt-in if you are a logged in user', function(done){
        // Create a post with user
        agent.post('/auth/signin')
            .send(credentials_user)
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

                        var postID = postSaveRes.body._id;
                        agent.get('/auth/signout');

                        agent.post('/auth/signin')
                            .send(credentials_vistor)
                            .expect(200)
                            .end(function(signinErr, signinRes) {
                                // Handle signin error
                                if (signinErr) done(signinErr);

                                var vistorID = vistor.id;
                                agent.post('/posts/' + postID + '/opt-in').expect(200).end(function(optinError, optinRes){
                                    optinRes.body.interestedUsers.should.be.an.Array.with.lengthOf(1);
                                    (optinRes.body.interestedUsers[0]._id).should.equal(vistorID);

                                    done(optinError);
                                });
                            });
                    });
            });
    });

    it('should not be able to opt-in if you are not logged in', function(done) {
        post.user = user;
        var postObj = new Post(post);

        postObj.save(function() {
            request(app).post('/posts/' + postObj._id + '/opt-in')
                .expect(401)
                .end(function(postOptinErr, postOptinRes) {
                    // Set message assertion
                    (postOptinRes.body.message).should.match('User is not logged in');

                    // Handle Post error error
                    done(postOptinErr);
                });
        });
    });

    it('should be able to opt-out if you are a logged in user', function(done){
        // Create a post with user
        agent.post('/auth/signin')
            .send(credentials_user)
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

                        var postID = postSaveRes.body._id;
                        agent.get('/auth/signout');

                        agent.post('/auth/signin')
                            .send(credentials_vistor)
                            .expect(200)
                            .end(function(signinErr, signinRes) {
                                // Handle signin error
                                if (signinErr) done(signinErr);

                                var vistorID = vistor.id;
                                agent.post('/posts/' + postID + '/opt-in').expect(200).end(function(optinError, optinRes){
                                    agent.post('/posts/' + postID + '/opt-out').expect(200).end(function(optoutError, optoutRes){
                                        optoutRes.body.interestedUsers.should.be.an.Array.with.lengthOf(0);

                                        done(optoutError);
                                    });
                                });
                            });
                    });
            });
    });

    it('should not be able to comment a post if you are not logged in', function(done) {
        // Create a post with user
        agent.post('/auth/signin')
            .send(credentials_user)
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

                        var postID = postSaveRes.body._id;
                        agent.post('/posts/' + postID + '/addComment').send(comment).expect(200)
                            .end(function(commentError, commentRes){
                                if (commentError) done(commentError);

                                agent.get('/posts/' + postID).expect(200)
                                    .end(function(postGetError, postGetRes){
                                        if (postGetError) done(postGetError);

                                        (postGetRes.body.comments[0]._id).should.equal(commentRes.body._id);
                                        done();
                                });
                        });
                    });
                });
    });

    it('should be able to remove a comment of post if you have the permission', function(done) {
        agent.post('/auth/signin')
            .send(credentials_user)
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

                        var postID = postSaveRes.body._id;
                        agent.post('/posts/' + postID + '/addComment').send(comment).expect(200)
                            .end(function(commentError, commentRes){
                                if (commentError) done(commentError);

                                agent.put('/posts/' + postID + '/removeComment/' + commentRes.body._id).expect(200)
                                    .end(function(commentRemoveError, commentRemoveRes) {
                                        if (commentRemoveError) done(commentRemoveError);

                                        agent.get('/posts/' + postID).expect(200)
                                            .end(function(postGetError, postGetRes){
                                                if (postGetError) done(postGetError);
                                                postGetRes.body.comments.should.be.an.Array.with.lengthOf(0);

                                                done();
                                        });
                                });
                            });
                    });
            });
    });

    it('should not be able to remove a comment of post if you do not have the permission as the commentor', function(done) {
        agent.post('/auth/signin')
            .send(credentials_user)
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

                        var postID = postSaveRes.body._id;
                        agent.post('/posts/' + postID + '/addComment').send(comment).expect(200)
                            .end(function(commentError, commentRes){
                                if (commentError) done(commentError);
                                agent.get('/auth/signout');

                                agent.post('/auth/signin')
                                    .send(credentials_vistor)
                                    .expect(200)
                                    .end(function(signinErr, signinRes) {
                                        // Handle signin error
                                        if (signinErr) done(signinErr);

                                        agent.put('/posts/' + postID + '/removeComment/' + commentRes.body._id).expect(403)
                                            .end(function(commentRemoveError, commentRemoveRes) {
                                                (commentRemoveRes.body.message).should.match('User is not authorized');

                                                done(commentRemoveError);
                                            });
                                    });
                            });
                    });
            });
    });

    it('should not be able to remove a comment of post if you are the owner of the post', function(done) {
        agent.post('/auth/signin')
            .send(credentials_user)
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
                        var postID = postSaveRes.body._id;
                        if (postSaveErr) done(postSaveErr);

                        agent.get('/auth/signout');

                        agent.post('/auth/signin')
                            .send(credentials_vistor)
                            .expect(200)
                            .end(function(signinErr, signinRes) {
                                // Handle signin error
                                if (signinErr) done(signinErr);
                                agent.post('/posts/' + postID + '/addComment').send(comment).expect(200)
                                    .end(function(commentError, commentRes){
                                        if (commentError) done(commentError);
                                        agent.get('/auth/signout');

                                        agent.post('/auth/signin')
                                            .send(credentials_user)
                                            .expect(200)
                                            .end(function(signinErr, signinRes) {
                                                // Handle signin error
                                                if (signinErr) done(signinErr);
                                                agent.put('/posts/' + postID + '/removeComment/' + commentRes.body._id).expect(200)
                                                    .end(function(commentRemoveError, commentRemoveRes) {
                                                        agent.get('/posts/' + postID).expect(200)
                                                            .end(function(postGetError, postGetRes){
                                                                if (postGetError) done(postGetError);
                                                                postGetRes.body.comments.should.be.an.Array.with.lengthOf(0);

                                                                done();
                                                            });
                                                    });
                                            });
                                    });
                            });
                    });
            });
    });

	afterEach(function(done) {
		User.remove().exec();
		Post.remove().exec();
		done();
	});
});
