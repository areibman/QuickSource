'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
	var experiences = require('../../app/controllers/experience.server.controller');

    // Create experiences
    app.route('/experiences/addPosition').post(users.requiresLogin, experiences.createPosition);
    app.route('/experiences/addEducation').post(users.requiresLogin, experiences.createEducation);
    app.route('/experiences/addCourse').post(users.requiresLogin, experiences.createCourse);
    app.route('/experiences/addPublication').post(users.requiresLogin, experiences.createPublication);

    // Experience handling
    app.route('/experiences/:experienceId')
        // View experience
        .get(experiences.read)
        // Update experience
        .put(experiences.update);

    // Remove experience
    app.route('/experiences/:experienceId/remove').put(users.requiresLogin, experiences.hasAuthorization, experiences.setInactive);

    // Finish by binding the Experience middleware
    app.param('experienceId', experiences.experienceByID);
};
