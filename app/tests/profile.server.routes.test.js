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
    Experience = mongoose.model('Experience'),
    agent = request.agent(app);

/**
 * Globals
 */
var user, credential, profile;
var exp_position, exp_education, exp_course, exp_publication;

/**
 * Unit tests
 */
describe('Profile Routes Unit Tests:', function() {
    credential = {
        username: 'username',
        password: 'password'
    };

	before(function(done) {
		user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.edu',
            username: credential.username,
            password: credential.password,
            provider: 'local',
            zipCode: '12345',
            enableEmailNotification: false
		});

        profile = new Profile({ user : user });

        exp_position = new Experience({
            profile: profile,
            type: 'position',
            title: 'Title',
            institution: 'Institution',
            isCurrent: true
        });
        exp_education = new Experience({
            profile: profile,
            type: 'education',
            title: 'Title',
            institution: 'Institution',
            isCurrent: true
        });
        exp_course = new Experience({
            profile: profile,
            type: 'course',
            title: 'Title',
            institution: 'Institution',
            isCurrent: true
        });
        exp_publication = new Experience({
            profile: profile,
            type: 'publication',
            title: 'Title',
            institution: 'Institution',
            isCurrent: true
        });


		user.save(function(){
            profile.save(done());
        });
	});

	describe('Profile Routes Test', function() {
        it('should be able to profile headline', function(done) {
            var change = { headline : 'Headline' };
            agent.post('/auth/signin')
                .send(credential)
                .expect(200)
                .end(function(signinErr) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    agent.put('/users/profile/update')
                        .send(change)
                        .expect(200)
                        .end(function(err){
                            if(err) done(err);

                            agent.get('/users/profile')
                                .expect(200)
                                .end(function(err, res){
                                    if(err) done(err);

                                    profile = res.body.profile;
                                    (profile.headline).should.match(change.headline);
                                    done();
                                });
                        });
                });
        });
		it('should be able to add position to profile', function(done) {
            agent.post('/auth/signin')
                .send(credential)
                .expect(200)
                .end(function(signinErr) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    var profile;
                    agent.post('/users/profile/addPosition')
                        .send(exp_position)
                        .expect(200)
                        .end(function(err){
                            if(err) done(err);

                            agent.get('/users/profile')
                                .expect(200)
                                .end(function(err, res){
                                    if(err) done(err);

                                    profile = res.body.profile;
                                    (profile.positions).should.be.an.Array.with.lengthOf(1);
                                    (profile.positions[0]._id).should.equal(exp_position._id.toString());
                                    done();
                                });
                        });
                });
		});
        it('should be able to add education to profile', function(done) {
            agent.post('/auth/signin')
                .send(credential)
                .expect(200)
                .end(function(signinErr) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    var profile;
                    agent.post('/users/profile/addEducation')
                        .send(exp_education)
                        .expect(200)
                        .end(function(err){
                            if(err) done(err);

                            agent.get('/users/profile')
                                .expect(200)
                                .end(function(err, res){
                                    if(err) done(err);

                                    profile = res.body.profile;
                                    (profile.educations).should.be.an.Array.with.lengthOf(1);
                                    (profile.educations[0]._id).should.equal(exp_education._id.toString());
                                    done();
                                });
                        });
                });
        });
        it('should be able to add course to profile', function(done) {
            agent.post('/auth/signin')
                .send(credential)
                .expect(200)
                .end(function(signinErr) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    var profile;
                    agent.post('/users/profile/addCourse')
                        .send(exp_course)
                        .expect(200)
                        .end(function(err){
                            if(err) done(err);
                            agent.get('/users/profile')
                                .expect(200)
                                .end(function(err, res){
                                    if(err) done(err);

                                    profile = res.body.profile;
                                    (profile.courses).should.be.an.Array.with.lengthOf(1);
                                    (profile.courses[0]._id).should.equal(exp_course._id.toString());
                                    done();
                                });
                        });
                });
        });
        it('should be able to add position to profile', function(done) {
            agent.post('/auth/signin')
                .send(credential)
                .expect(200)
                .end(function(signinErr) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    var profile, position;
                    agent.post('/users/profile/addPublication')
                        .send(exp_publication)
                        .expect(200)
                        .end(function(err, res){
                            if(err) done(err);
                            position = res.body;

                            agent.get('/users/profile')
                                .expect(200)
                                .end(function(err, res){
                                    if(err) done(err);

                                    profile = res.body.profile;
                                    (profile.publications).should.be.an.Array.with.lengthOf(1);
                                    (profile.publications[0]._id).should.equal(exp_publication._id.toString());
                                    done();
                                });
                        });
                });
        });

        it('should be able to update experience of a profile', function(done) {
            var change = { title : 'This is a new title' };

            agent.post('/auth/signin')
                .send(credential)
                .expect(200)
                .end(function(signinErr) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    var profile;
                    agent.put('/users/profile/' + exp_position.id + '/update')
                        .send(change)
                        .expect(200)
                        .end(function(err, res){
                            if(err) done(err);

                            agent.get('/users/profile')
                                .expect(200)
                                .end(function(err, res){
                                    if(err) done(err);

                                    profile = res.body.profile;
                                    (profile.positions).should.be.an.Array.with.lengthOf(1);
                                    (profile.positions[0].title).should.match(change.title);
                                    done();
                                });
                        });
                });
        });

        it('should be able to remove a experience of a profile', function(done) {
            var change = { title : 'This is a new title' };

            agent.post('/auth/signin')
                .send(credential)
                .expect(200)
                .end(function(signinErr) {
                    // Handle signin error
                    if (signinErr) done(signinErr);

                    var profile;
                    agent.put('/users/profile/' + exp_education.id + '/remove')
                        .send(change)
                        .expect(200)
                        .end(function(err, res){
                            if(err) done(err);

                            agent.get('/users/profile')
                                .expect(200)
                                .end(function(err, res){
                                    if(err) done(err);

                                    profile = res.body.profile;
                                    (profile.educations).should.be.an.Array.with.lengthOf(0);

                                    Experience.findById(exp_education.id, function(err, experience){
                                        if(err) done(err);

                                        (experience.isActive).should.equal(false);
                                        done();
                                    });
                                });
                        });
                });
        });
	});

	after(function(done) {
		Profile.remove().exec();
		User.remove().exec();
		done();
	});
});
