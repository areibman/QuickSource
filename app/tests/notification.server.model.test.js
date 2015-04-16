'use strict';

/**
* Module dependencies.
*/
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Notification = mongoose.model('Notification');

/**
* Globals
*/
var user, credentials_user, vistor, credentials_vistor,  notification;

/**
* Unit tests
*/
describe('Notification Model Unit Tests:', function() {
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

	describe('Method Save', function() {
		it('should not be able to save without recipient', function(done) {
			return notification.save(function(err) {
                (err.errors.recipient.message).should.match('Recipient of the notification is required');
				done();
			});
		});

        it('should not be able to save without message', function(done) {
            notification.recipient = vistor;
            notification.message = undefined;
            return notification.save(function(err) {
                (err.errors.message.message).should.match('Message of the notification is required');
                done();
            });
        });
	});

	afterEach(function(done) {
		Notification.remove().exec();
		User.remove().exec();
		done();
	});
});
