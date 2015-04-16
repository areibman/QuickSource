'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
    Profile = mongoose.model('Profile'),
    agent = request.agent(app);

/**
 * Globals
 */
var user1, user2, credentials, profile, experience;

/**
 * Unit tests
 */
describe('User Routes Unit Tests:', function() {
    beforeEach(function(done) {
        credentials = {
            username: 'username',
            password: 'password'
        };

		user1 = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local',
            zipCode: '12345'
		});
		user2 = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local',
            zipCode: '12345'
		});

        profile = {
            headline: 'This is a test headline'
        };

        user1.save(function(){
            done();
        });
	});

	describe('User Information/Profile Updates', function() {
		it('should be able to validate email', function(done) {
            var user1Id = user1._id;

            agent.post('/users/' + user1Id + '/emailValidation/')
                .expect(200)
                .end(function(err, res){
                    User.findById(user1Id, function(err, user){
                        user.emailValidated.should.equal(true);
                        done();
                    });
            });
		});

        it('should be able to update headline', function(done) {
            agent.post('/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function(signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    agent.put('/users/profile/update')
                        .send(profile)
                        .expect(200)
                        .end(function(err, res){
                            (res.body.headline).should.match('This is a test headline');
                            done();
                        });
                });
        });
	});

    afterEach(function(done) {
		User.remove().exec();
		done();
	});
});
