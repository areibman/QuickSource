'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
    Profile = mongoose.model('Profile'),
	Experience = mongoose.model('Experience');

/**
 * Globals
 */
var user, profile, experience;

/**
 * Unit tests
 */
describe('Experience Model Unit Tests:', function() {
	beforeEach(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.edu',
            username: 'username',
            password: 'password',
            zipCode: '12345'
        });

		user.save(function() {
            profile = new Profile({
				headline: 'This is a profile'
			});
            profile.save();
			done();
		});

    });

	describe('Method Save', function() {
		it('should not be able to save without type specified', function(done) {

            experience = new Experience({
                profile: profile,
                title: 'Experience',
                institution: 'Emory',
                isCurrent: true
            });
            return experience.save(function(err) {
                (err.errors.type.message).should.match('Type of experience not specified');
				done();
			});
		});

        it('should not be able to save without title specified', function(done) {

            experience = new Experience({
                profile: profile,
                type: 'position',
                institution: 'Emory',
                isCurrent: true
            });
            return experience.save(function(err) {
                (err.errors.title.message).should.match('Title of the experience is required');
                done();
            });
        });

        it('should not be able to save without institution specified', function(done) {

            experience = new Experience({
                profile: profile,
                type: 'position',
                title: 'Experience',
                isCurrent: true
            });
            return experience.save(function(err) {
                (err.errors.institution.message).should.match('Affiliated institution of the experience is required');
                done();
            });
        });

        it('should not be able to save without status (isCurrent) specified', function(done) {

            experience = new Experience({
                profile: profile,
                type: 'position',
                institution: 'Emory'
            });
            return experience.save(function(err) {
                (err.errors.isCurrent.message).should.match('Current status of the experience not specified');
                done();
            });
        });
	});

	afterEach(function(done) { 
		Experience.remove().exec();
        Profile.remove().exec();
		User.remove().exec();
		done();
	});
});
