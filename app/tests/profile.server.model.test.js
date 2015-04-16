'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Profile = mongoose.model('Profile');

/**
 * Globals
 */
var user, profile;

/**
 * Unit tests
 */
describe('Profile Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.edu',
			username: 'username',
			password: 'password'
		});

		user.save(function() {
			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {

            profile = new Profile({ user : user });
			return profile.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Profile.remove().exec();
		User.remove().exec();
		
		done();
	});
});
