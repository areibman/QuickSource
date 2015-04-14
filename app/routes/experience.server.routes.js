'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
	var experiences = require('../../app/controllers/experience.server.controller');

    // Experience handling
    app.route('/experiences/:experienceId')
        // View experience
        .get(experiences.read)
        // Update experience
        .put(experiences.update);

    // Finish by binding the Experience middleware
    app.param('experienceId', experiences.experienceByID);
};
