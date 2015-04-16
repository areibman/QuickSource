'use strict';

/**
* Module dependencies.
*/
var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
    agent = request.agent(app),
	Notification = mongoose.model('Notification');

/**
* Globals
*/
var user, credentials_user, vistor, credentials_vistor,  notification;

/**
* Unit tests
*/
describe('Notification Routes Unit Tests:', function() {
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
            zipCode: '12345',
            enableEmailNotification: false
        });

        vistor = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.edu',
            username: credentials_vistor.username,
            password: credentials_vistor.password,
            provider: 'local',
            zipCode: '12345',
            enableEmailNotification: false
        });

        notification = new Notification({
            title: 'Title',
            message: 'Message'
        });

		user.save(function() {
            vistor.save(done);
		});
	});

	describe('Notification Routes Test', function() {
		it('should be able to update recipient\'s notification', function(done) {
            notification.recipient = vistor;

            agent.post('/auth/signin')
                .send(credentials_user)
                .expect(200)
                .end(function(signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    var sentNotification;
                    agent.post('/notification/user/' + vistor.id + '/send')
                        .send(notification)
                        .expect(200)
                        .end(function(sendErr, sendRes){
                            sentNotification = sendRes.body;

                            User.findById(vistor._id, function(err, res){
                                (res.notifications).should.be.an.Array.with.lengthOf(1);
                                (res.notifications[0].toString()).should.equal(sentNotification._id);
                                done(err);
                            });
                        });
                });
		});
	});

	afterEach(function(done) {
		Notification.remove().exec();
		User.remove().exec();
		done();
	});
});
