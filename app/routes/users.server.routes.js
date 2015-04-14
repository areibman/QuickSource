'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller');
    var profile = require('../../app/controllers/profile.server.controller');
    var experiences = require('../../app/controllers/experience.server.controller');

	// Setting up the users profile api
	app.route('/users/accounts').get(users.me)  // Basic account info
	                            .put(users.update)
                                .delete(users.removeOAuthProvider);

    // User profile
    app.route('/users/profile').get(users.profile); // Extended user profile info
    app.route('/users/profile/addPosition').post(users.requiresLogin, experiences.createPosition);
    app.route('/users/profile/addEducation').post(users.requiresLogin, experiences.createEducation);
    app.route('/users/profile/addCourse').post(users.requiresLogin, experiences.createCourse);
    app.route('/users/profile/addPublication').post(users.requiresLogin, experiences.createPublication);
    app.route('/users/profile/:experienceId/remove').put(users.requiresLogin, experiences.hasAuthorization, experiences.setInactive);

	// Setting up the users password api
	app.route('/users/password').post(users.changePassword);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	// Setting the linkedin oauth routes
	app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
	app.route('/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

	// Setting the github oauth routes
	app.route('/auth/github').get(passport.authenticate('github'));
	app.route('/auth/github/callback').get(users.oauthCallback('github'));

	// Finish by binding middlewares
	app.param('userId', users.userByID);
    app.param('experienceId', experiences.experienceByID);
};
